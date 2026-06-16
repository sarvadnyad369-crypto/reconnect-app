const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

const USER_SELECT = 'displayName username name avatar profileImage profilePicture isVerified bio createdAt';
const MESSAGE_SELECT = '';
const MAX_LIMIT = 50;

function getToken(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7);
  if (req.cookies?.token) return req.cookies.token;
  if (req.cookies?.reconnect_token) return req.cookies.reconnect_token;
  if (req.query?.token) return req.query.token;
  return '';
}

function getUserIdFromPayload(payload) {
  return payload?.id || payload?._id || payload?.userId || payload?.sub;
}

async function requireAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Login required' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = getUserIdFromPayload(payload);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: 'Invalid login token' });
    }

    const user = await User.findById(userId).select(USER_SELECT);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Login required' });
  }
}

function cleanText(value) {
  return sanitizeHtml(String(value || ''), {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
}

function toObjectId(value) {
  if (!mongoose.Types.ObjectId.isValid(value)) return null;
  return new mongoose.Types.ObjectId(value);
}

function participantId(participant) {
  return String(participant?._id || participant);
}

function isParticipant(conversation, userId) {
  return conversation.participants.some((participant) => participantId(participant) === String(userId));
}

function makeDirectKey(a, b) {
  return [String(a), String(b)].sort().join(':');
}

async function populateConversation(query) {
  return query
    .populate('participants', USER_SELECT)
    .populate({
      path: 'lastMessage',
      select: MESSAGE_SELECT,
      populate: { path: 'sender', select: USER_SELECT }
    });
}

async function populateMessage(query) {
  return query
    .populate('sender', USER_SELECT)
    .populate({ path: 'replyTo', select: 'text type sender createdAt', populate: { path: 'sender', select: USER_SELECT } });
}

async function getUnreadCount(conversationId, userId) {
  return Message.countDocuments({
    conversation: conversationId,
    sender: { $ne: userId },
    isDeleted: false,
    deletedFor: { $ne: userId },
    'seenBy.user': { $ne: userId }
  });
}

async function emitConversationUpdate(req, conversationId, eventName, payload) {
  const io = req.app.get('io');
  if (!io) return;

  const conversation = await Conversation.findById(conversationId).select('participants');
  if (!conversation) return;

  io.to(`conversation:${conversationId}`).emit(eventName, payload);
  for (const participant of conversation.participants) {
    io.to(`user:${participantId(participant)}`).emit(eventName, payload);
  }
}

router.use(requireAuth);

router.get('/status', (req, res) => {
  res.json({
    success: true,
    service: 'messages',
    status: 'online',
    userId: req.userId
  });
});

router.get('/conversations', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), MAX_LIMIT);
    const skip = (page - 1) * limit;

    const conversations = await populateConversation(
      Conversation.find({ participants: req.userId })
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
    );

    const data = await Promise.all(
      conversations.map(async (conversation) => {
        const obj = conversation.toObject();
        obj.unreadCount = await getUnreadCount(conversation._id, req.userId);
        return obj;
      })
    );

    res.json({ success: true, conversations: data, page, limit });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load conversations', error: error.message });
  }
});

router.post('/conversations/direct', async (req, res) => {
  try {
    const otherUserId = req.body.userId || req.body.recipientId || req.body.to;
    const otherObjectId = toObjectId(otherUserId);

    if (!otherObjectId) {
      return res.status(400).json({ success: false, message: 'Valid userId is required' });
    }

    if (String(otherObjectId) === req.userId) {
      return res.status(400).json({ success: false, message: 'You cannot message yourself' });
    }

    const otherUser = await User.findById(otherObjectId).select(USER_SELECT);
    if (!otherUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const directKey = makeDirectKey(req.userId, otherObjectId);
    let conversation = await Conversation.findOne({ type: 'direct', directKey });

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'direct',
        directKey,
        participants: [req.userId, otherObjectId],
        lastMessageAt: new Date()
      });
    }

    conversation = await populateConversation(Conversation.findById(conversation._id));

    res.json({ success: true, conversation });
  } catch (error) {
    if (error.code === 11000) {
      const directKey = makeDirectKey(req.userId, req.body.userId || req.body.recipientId || req.body.to);
      const conversation = await populateConversation(Conversation.findOne({ directKey }));
      return res.json({ success: true, conversation });
    }

    res.status(500).json({ success: false, message: 'Could not create conversation', error: error.message });
  }
});

router.post('/conversations/group', async (req, res) => {
  try {
    const title = cleanText(req.body.title);
    const participantIds = Array.isArray(req.body.participants) ? req.body.participants : [];
    const validParticipants = [...new Set([req.userId, ...participantIds].filter(mongoose.Types.ObjectId.isValid).map(String))];

    if (!title) {
      return res.status(400).json({ success: false, message: 'Group title is required' });
    }

    if (validParticipants.length < 2) {
      return res.status(400).json({ success: false, message: 'Add at least one more user' });
    }

    const conversation = await Conversation.create({
      type: 'group',
      title,
      photo: req.body.photo || '',
      participants: validParticipants,
      admins: [req.userId],
      lastMessageAt: new Date()
    });

    const populated = await populateConversation(Conversation.findById(conversation._id));
    res.status(201).json({ success: true, conversation: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not create group', error: error.message });
  }
});

router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const conversationId = toObjectId(req.params.conversationId);
    if (!conversationId) {
      return res.status(400).json({ success: false, message: 'Invalid conversation id' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !isParticipant(conversation, req.userId)) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit || '30', 10), 1), MAX_LIMIT);
    const filter = {
      conversation: conversationId,
      deletedFor: { $ne: req.userId }
    };

    if (req.query.before && mongoose.Types.ObjectId.isValid(req.query.before)) {
      const beforeMessage = await Message.findById(req.query.before).select('createdAt');
      if (beforeMessage) filter.createdAt = { $lt: beforeMessage.createdAt };
    }

    const messages = await populateMessage(
      Message.find(filter).sort({ createdAt: -1 }).limit(limit)
    );

    res.json({ success: true, messages: messages.reverse(), limit });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load messages', error: error.message });
  }
});

router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const conversationId = toObjectId(req.params.conversationId);
    if (!conversationId) {
      return res.status(400).json({ success: false, message: 'Invalid conversation id' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !isParticipant(conversation, req.userId)) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const text = cleanText(req.body.text || req.body.body || req.body.message);
    const encryptedBody = String(req.body.encryptedBody || '');
    const type = req.body.type || (req.body.attachments?.length ? 'file' : 'text');
    const attachments = Array.isArray(req.body.attachments) ? req.body.attachments.slice(0, 10) : [];

    if (!text && !encryptedBody && attachments.length === 0) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.userId,
      text,
      encryptedBody,
      type,
      attachments,
      replyTo: req.body.replyTo && mongoose.Types.ObjectId.isValid(req.body.replyTo) ? req.body.replyTo : null,
      seenBy: [{ user: req.userId, seenAt: new Date() }]
    });

    conversation.lastMessage = message._id;
    conversation.lastMessageAt = message.createdAt;
    await conversation.save();

    const populated = await populateMessage(Message.findById(message._id));
    await emitConversationUpdate(req, conversationId, 'message:new', { conversationId: String(conversationId), message: populated });

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not send message', error: error.message });
  }
});

router.post('/send-direct', async (req, res) => {
  try {
    const recipientId = req.body.recipientId || req.body.userId || req.body.to;
    const recipientObjectId = toObjectId(recipientId);

    if (!recipientObjectId) {
      return res.status(400).json({ success: false, message: 'Valid recipientId is required' });
    }

    if (String(recipientObjectId) === req.userId) {
      return res.status(400).json({ success: false, message: 'You cannot message yourself' });
    }

    const recipient = await User.findById(recipientObjectId).select('_id');
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    const directKey = makeDirectKey(req.userId, recipientObjectId);
    let conversation = await Conversation.findOne({ type: 'direct', directKey });

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'direct',
        directKey,
        participants: [req.userId, recipientObjectId],
        lastMessageAt: new Date()
      });
    }

    req.params.conversationId = conversation._id;

    const text = cleanText(req.body.text || req.body.body || req.body.message);
    const encryptedBody = String(req.body.encryptedBody || '');
    const attachments = Array.isArray(req.body.attachments) ? req.body.attachments.slice(0, 10) : [];
    const type = req.body.type || (attachments.length ? 'file' : 'text');

    if (!text && !encryptedBody && attachments.length === 0) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.userId,
      text,
      encryptedBody,
      type,
      attachments,
      seenBy: [{ user: req.userId, seenAt: new Date() }]
    });

    conversation.lastMessage = message._id;
    conversation.lastMessageAt = message.createdAt;
    await conversation.save();

    const populatedMessage = await populateMessage(Message.findById(message._id));
    const populatedConversation = await populateConversation(Conversation.findById(conversation._id));

    await emitConversationUpdate(req, conversation._id, 'message:new', {
      conversationId: String(conversation._id),
      conversation: populatedConversation,
      message: populatedMessage
    });

    res.status(201).json({ success: true, conversation: populatedConversation, message: populatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not send direct message', error: error.message });
  }
});

router.post('/conversations/:conversationId/read', async (req, res) => {
  try {
    const conversationId = toObjectId(req.params.conversationId);
    if (!conversationId) {
      return res.status(400).json({ success: false, message: 'Invalid conversation id' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !isParticipant(conversation, req.userId)) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.userId },
        'seenBy.user': { $ne: req.userId }
      },
      {
        $push: { seenBy: { user: req.userId, seenAt: new Date() } },
        $set: { status: 'read' }
      }
    );

    await emitConversationUpdate(req, conversationId, 'message:read', {
      conversationId: String(conversationId),
      userId: req.userId
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not mark messages as read', error: error.message });
  }
});

router.patch('/:messageId', async (req, res) => {
  try {
    const messageId = toObjectId(req.params.messageId);
    if (!messageId) {
      return res.status(400).json({ success: false, message: 'Invalid message id' });
    }

    const message = await Message.findById(messageId);
    if (!message || String(message.sender) !== req.userId) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.isDeleted) {
      return res.status(400).json({ success: false, message: 'Deleted message cannot be edited' });
    }

    const text = cleanText(req.body.text || req.body.body || req.body.message);
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    message.text = text;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    const populated = await populateMessage(Message.findById(message._id));
    await emitConversationUpdate(req, message.conversation, 'message:edited', { message: populated });

    res.json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not edit message', error: error.message });
  }
});

router.delete('/:messageId', async (req, res) => {
  try {
    const messageId = toObjectId(req.params.messageId);
    if (!messageId) {
      return res.status(400).json({ success: false, message: 'Invalid message id' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const conversation = await Conversation.findById(message.conversation);
    if (!conversation || !isParticipant(conversation, req.userId)) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const everyone = req.query.everyone === 'true' || req.body?.everyone === true;

    if (everyone) {
      if (String(message.sender) !== req.userId) {
        return res.status(403).json({ success: false, message: 'Only sender can delete for everyone' });
      }

      message.text = '';
      message.encryptedBody = '';
      message.attachments = [];
      message.isDeleted = true;
    } else if (!message.deletedFor.map(String).includes(req.userId)) {
      message.deletedFor.push(req.userId);
    }

    await message.save();

    await emitConversationUpdate(req, message.conversation, 'message:deleted', {
      messageId: String(message._id),
      conversationId: String(message.conversation),
      everyone
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not delete message', error: error.message });
  }
});

router.post('/:messageId/reactions', async (req, res) => {
  try {
    const messageId = toObjectId(req.params.messageId);
    const emoji = cleanText(req.body.emoji).slice(0, 16);

    if (!messageId || !emoji) {
      return res.status(400).json({ success: false, message: 'Message id and emoji are required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const conversation = await Conversation.findById(message.conversation);
    if (!conversation || !isParticipant(conversation, req.userId)) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.reactions = message.reactions.filter((reaction) => String(reaction.user) !== req.userId);
    message.reactions.push({ user: req.userId, emoji, createdAt: new Date() });
    await message.save();

    const populated = await populateMessage(Message.findById(message._id));
    await emitConversationUpdate(req, message.conversation, 'message:reaction', { message: populated });

    res.json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not react to message', error: error.message });
  }
});

router.delete('/:messageId/reactions', async (req, res) => {
  try {
    const messageId = toObjectId(req.params.messageId);
    if (!messageId) {
      return res.status(400).json({ success: false, message: 'Invalid message id' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const conversation = await Conversation.findById(message.conversation);
    if (!conversation || !isParticipant(conversation, req.userId)) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.reactions = message.reactions.filter((reaction) => String(reaction.user) !== req.userId);
    await message.save();

    const populated = await populateMessage(Message.findById(message._id));
    await emitConversationUpdate(req, message.conversation, 'message:reaction', { message: populated });

    res.json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not remove reaction', error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const q = cleanText(req.query.q);
    if (!q) return res.json({ success: true, messages: [] });

    const conversations = await Conversation.find({ participants: req.userId }).select('_id');
    const conversationIds = conversations.map((conversation) => conversation._id);

    const messages = await populateMessage(
      Message.find({
        conversation: { $in: conversationIds },
        deletedFor: { $ne: req.userId },
        isDeleted: false,
        $text: { $search: q }
      })
        .sort({ createdAt: -1 })
        .limit(30)
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not search messages', error: error.message });
  }
});

module.exports = router;
