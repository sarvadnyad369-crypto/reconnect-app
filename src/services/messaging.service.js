const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const USER_SELECT = 'displayName username name avatar avatarUrl profileImage profilePhoto email';

function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function cleanText(value = '') {
  return sanitizeHtml(String(value || ''), {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
}

function toObjectId(id, label = 'id') {
  if (!mongoose.Types.ObjectId.isValid(id)) fail(400, `Invalid ${label}`);
  return new mongoose.Types.ObjectId(id);
}

function userIdOf(user) {
  const id = user?._id || user?.id || user?.userId || user?.sub;
  if (!id) fail(401, 'Login required');
  return String(id);
}

async function populateConversation(query) {
  return query
    .populate('participants.user', USER_SELECT)
    .populate('createdBy', USER_SELECT)
    .populate('lastSender', USER_SELECT)
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: USER_SELECT }
    });
}

async function populateMessage(query) {
  return query
    .populate('sender', USER_SELECT)
    .populate('replyTo')
    .populate('reactions.user', USER_SELECT)
    .populate('readBy.user', USER_SELECT);
}

async function requireConversationAccess(userId, conversationId) {
  const conversation = await Conversation.findById(toObjectId(conversationId, 'conversation id'));
  if (!conversation || conversation.isDeleted) fail(404, 'Conversation not found');
  if (!conversation.hasParticipant(userId)) fail(403, 'You are not part of this conversation');
  return conversation;
}

async function getStatus(userId) {
  const totalConversations = await Conversation.countDocuments({
    'participants.user': userId,
    isDeleted: false
  });
  const totalMessages = await Message.countDocuments({ sender: userId });
  return { totalConversations, totalMessages };
}

async function listConversations(userId, limit = 30) {
  const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 80);
  const query = Conversation.find({
    'participants.user': userId,
    isDeleted: false
  })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .limit(safeLimit);

  return populateConversation(query);
}

async function getOrCreateDirectConversation(userId, otherUserId) {
  const me = toObjectId(userId, 'user id');
  const other = toObjectId(otherUserId, 'other user id');
  if (String(me) === String(other)) fail(400, 'You cannot create a chat with yourself');

  let conversation = await Conversation.findOne({
    type: 'direct',
    isDeleted: false,
    'participants.user': { $all: [me, other] }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      type: 'direct',
      createdBy: me,
      participants: [
        { user: me, role: 'owner' },
        { user: other, role: 'member' }
      ],
      lastMessageAt: new Date()
    });
  }

  return populateConversation(Conversation.findById(conversation._id));
}

async function createGroupConversation(userId, payload = {}) {
  const title = cleanText(payload.title || payload.name || 'New group').slice(0, 80);
  const ids = Array.isArray(payload.participantIds) ? payload.participantIds : [];
  const uniqueIds = [...new Set([String(userId), ...ids.map(String)])]
    .filter(id => mongoose.Types.ObjectId.isValid(id));

  if (uniqueIds.length < 2) fail(400, 'Group needs at least 2 users');

  const conversation = await Conversation.create({
    type: 'group',
    title,
    avatarUrl: cleanText(payload.avatarUrl || ''),
    createdBy: userId,
    participants: uniqueIds.map(id => ({
      user: id,
      role: String(id) === String(userId) ? 'owner' : 'member'
    })),
    lastMessageAt: new Date()
  });

  return populateConversation(Conversation.findById(conversation._id));
}

async function getConversation(userId, conversationId) {
  await requireConversationAccess(userId, conversationId);
  return populateConversation(Conversation.findById(conversationId));
}

async function getMessages(userId, conversationId, options = {}) {
  await requireConversationAccess(userId, conversationId);

  const limit = Math.min(Math.max(Number(options.limit) || 40, 1), 100);
  const filter = {
    conversation: toObjectId(conversationId, 'conversation id'),
    deletedForEveryone: false,
    deletedFor: { $ne: toObjectId(userId, 'user id') }
  };

  if (options.before && mongoose.Types.ObjectId.isValid(options.before)) {
    const beforeMessage = await Message.findById(options.before).select('createdAt');
    if (beforeMessage) filter.createdAt = { $lt: beforeMessage.createdAt };
  }

  const query = Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit);

  const messages = await populateMessage(query);
  return messages.reverse();
}

async function sendMessage(userId, conversationId, payload = {}) {
  const conversation = await requireConversationAccess(userId, conversationId);
  const text = cleanText(payload.text || '').slice(0, 5000);
  const attachments = Array.isArray(payload.attachments) ? payload.attachments.slice(0, 10).map(item => ({
    url: cleanText(item.url || ''),
    name: cleanText(item.name || ''),
    mimeType: cleanText(item.mimeType || ''),
    size: Number(item.size || 0),
    width: item.width ? Number(item.width) : null,
    height: item.height ? Number(item.height) : null
  })).filter(item => item.url) : [];

  if (!text && attachments.length === 0) fail(400, 'Message cannot be empty');

  const type = ['text', 'image', 'video', 'file'].includes(payload.type) ? payload.type : (attachments.length ? 'file' : 'text');

  const message = await Message.create({
    conversation: conversation._id,
    sender: userId,
    type,
    text,
    attachments,
    replyTo: payload.replyTo && mongoose.Types.ObjectId.isValid(payload.replyTo) ? payload.replyTo : null,
    readBy: [{ user: userId, readAt: new Date() }],
    deliveredTo: [userId],
    metadata: payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {}
  });

  await conversation.touchLastMessage(message);

  return populateMessage(Message.findById(message._id));
}

async function editMessage(userId, messageId, payload = {}) {
  const message = await Message.findById(toObjectId(messageId, 'message id'));
  if (!message || message.deletedForEveryone) fail(404, 'Message not found');
  if (String(message.sender) !== String(userId)) fail(403, 'Only sender can edit this message');

  const text = cleanText(payload.text || '').slice(0, 5000);
  if (!text) fail(400, 'Message cannot be empty');

  message.text = text;
  message.editedAt = new Date();
  await message.save();

  const conversation = await Conversation.findById(message.conversation);
  if (conversation && String(conversation.lastMessage) === String(message._id)) {
    conversation.lastMessageText = text;
    await conversation.save();
  }

  return populateMessage(Message.findById(message._id));
}

async function deleteMessage(userId, messageId, mode = 'me') {
  const message = await Message.findById(toObjectId(messageId, 'message id'));
  if (!message) fail(404, 'Message not found');

  await requireConversationAccess(userId, message.conversation);

  if (mode === 'everyone') {
    if (String(message.sender) !== String(userId)) fail(403, 'Only sender can delete for everyone');
    message.deletedForEveryone = true;
    message.text = '';
    message.attachments = [];
  } else if (!message.deletedFor.some(id => String(id) === String(userId))) {
    message.deletedFor.push(userId);
  }

  await message.save();
  return { messageId: String(message._id), mode, deletedForEveryone: message.deletedForEveryone };
}

async function toggleReaction(userId, messageId, emoji) {
  const safeEmoji = cleanText(emoji || '👍').slice(0, 8) || '👍';
  const message = await Message.findById(toObjectId(messageId, 'message id'));
  if (!message || message.deletedForEveryone) fail(404, 'Message not found');
  await requireConversationAccess(userId, message.conversation);

  const existingIndex = message.reactions.findIndex(r => String(r.user) === String(userId) && r.emoji === safeEmoji);
  if (existingIndex >= 0) {
    message.reactions.splice(existingIndex, 1);
  } else {
    message.reactions = message.reactions.filter(r => String(r.user) !== String(userId));
    message.reactions.push({ user: userId, emoji: safeEmoji, createdAt: new Date() });
  }
  await message.save();

  return populateMessage(Message.findById(message._id));
}

async function markRead(userId, conversationId) {
  const conversation = await requireConversationAccess(userId, conversationId);
  const now = new Date();

  await Message.updateMany(
    {
      conversation: conversation._id,
      deletedForEveryone: false,
      'readBy.user': { $ne: toObjectId(userId, 'user id') }
    },
    { $push: { readBy: { user: userId, readAt: now } } }
  );

  const participant = conversation.participants.find(p => String(p.user) === String(userId));
  if (participant) participant.lastReadAt = now;
  await conversation.save();

  return { conversationId: String(conversation._id), readAt: now };
}

async function searchMessages(userId, q = '', conversationId = null, limit = 30) {
  const text = cleanText(q);
  if (!text) return [];

  const conversations = await Conversation.find({
    'participants.user': userId,
    isDeleted: false
  }).select('_id');
  const ids = conversations.map(c => c._id);
  const filter = {
    conversation: { $in: ids },
    deletedForEveryone: false,
    deletedFor: { $ne: toObjectId(userId, 'user id') },
    text: { $regex: text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
  };

  if (conversationId) {
    await requireConversationAccess(userId, conversationId);
    filter.conversation = toObjectId(conversationId, 'conversation id');
  }

  return populateMessage(Message.find(filter).sort({ createdAt: -1 }).limit(Math.min(Number(limit) || 30, 80)));
}

module.exports = {
  userIdOf,
  getStatus,
  listConversations,
  getOrCreateDirectConversation,
  createGroupConversation,
  getConversation,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  toggleReaction,
  markRead,
  searchMessages
};
