const express = require('express');
const crypto = require('crypto');

const Group = require('../models/Group');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const publicUser = '_id displayName username avatar isVerified';

function uid(req) {
  return req.user._id || req.user.id || req.user.userId;
}

function cleanUsername(value) {
  return String(value || '').toLowerCase().replace('@', '').trim();
}

function cleanUsernames(list) {
  if (!Array.isArray(list)) return [];

  return Array.from(
    new Set(
      list
        .map(cleanUsername)
        .filter(Boolean)
        .slice(0, 100)
    )
  );
}

function cleanMedia(media) {
  return Array.isArray(media)
    ? media.slice(0, 4).map(item => ({
        url: String(item.url || item.src || '').slice(0, 9000000),
        type: String(item.type || '').slice(0, 120),
        name: String(item.name || 'Attachment').slice(0, 180),
        size: Number(item.size || 0)
      }))
    : [];
}

function isMember(group, userId) {
  return (group.members || []).some(id => String(id) === String(userId));
}

function isAdmin(group, userId) {
  return String(group.admin) === String(userId) || String(group.admin?._id) === String(userId);
}

async function populateGroup(query) {
  return query
    .populate('admin', publicUser)
    .populate('members', publicUser)
    .populate('messages.sender', publicUser);
}

function serializeGroup(group, requesterId) {
  const plain = group.toObject ? group.toObject() : group;
  const messages = plain.messages || [];
  const lastMessage = messages.length ? messages[messages.length - 1] : null;
  const unreadCount = messages.filter(msg => {
    const senderId = String(msg.sender?._id || msg.sender || '');
    const read = (msg.readBy || []).some(r => String(r.user?._id || r.user) === String(requesterId));
    return senderId !== String(requesterId) && !read;
  }).length;

  return {
    ...plain,
    memberCount: (plain.members || []).length,
    messageCount: messages.length,
    lastMessage,
    unreadCount,
    isAdmin: String(plain.admin?._id || plain.admin) === String(requesterId),
    canSend:
      !plain.settings?.adminOnlyMessages ||
      String(plain.admin?._id || plain.admin) === String(requesterId)
  };
}

async function findUsersByUsernames(usernames) {
  const clean = cleanUsernames(usernames);
  if (!clean.length) return [];

  return User.find({ username: { $in: clean } }).select(publicUser);
}

router.get('/', auth, async (req, res) => {
  try {
    const myId = uid(req);
    const groups = await populateGroup(
      Group.find({ members: myId, isDeleted: false })
        .sort({ updatedAt: -1 })
        .limit(100)
    );

    res.json({
      success: true,
      groups: groups.map(group => serializeGroup(group, myId))
    });
  } catch (error) {
    console.error('Load groups error:', error);
    res.status(500).json({ success: false, message: 'Could not load groups' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const myId = uid(req);
    const name = String(req.body.name || '').trim().slice(0, 50);
    if (!name) return res.status(400).json({ success: false, message: 'Group name is required' });

    const memberUsers = await findUsersByUsernames(req.body.memberUsernames || req.body.members || []);
    const memberIds = new Set(memberUsers.map(user => String(user._id)));
    memberIds.add(String(myId));

    const group = await Group.create({
      name,
      admin: myId,
      members: Array.from(memberIds),
      settings: {
        adminOnlyMessages: Boolean(req.body.adminOnlyMessages || req.body.adminOnly),
        openJoin: Boolean(req.body.openJoin),
        inviteRequired: typeof req.body.inviteRequired === 'boolean' ? req.body.inviteRequired : !Boolean(req.body.openJoin)
      }
    });

    const populated = await populateGroup(Group.findById(group._id));

    res.status(201).json({
      success: true,
      message: 'Group created',
      group: serializeGroup(populated, myId),
      missingUsernames: cleanUsernames(req.body.memberUsernames || req.body.members || []).filter(username => !memberUsers.some(u => u.username === username))
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ success: false, message: 'Could not create group' });
  }
});

router.post('/join', auth, async (req, res) => {
  try {
    const myId = uid(req);
    const inviteToken = String(req.body.inviteToken || req.body.token || '').trim();
    const groupId = String(req.body.groupId || '').trim();

    const query = inviteToken ? { inviteToken, isDeleted: false } : { _id: groupId, isDeleted: false };
    let group = await Group.findOne(query);

    if (!group) return res.status(404).json({ success: false, message: 'Group not found or invite expired' });

    if (!group.settings?.openJoin && group.settings?.inviteRequired && !inviteToken) {
      return res.status(403).json({ success: false, message: 'Invite link is required for this group' });
    }

    if (!isMember(group, myId)) {
      group.members.push(myId);
      await group.save();
    }

    group = await populateGroup(Group.findById(group._id));

    res.json({
      success: true,
      message: 'Joined group',
      group: serializeGroup(group, myId)
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ success: false, message: 'Could not join group' });
  }
});

router.get('/invite/:token', auth, async (req, res) => {
  try {
    const myId = uid(req);
    const group = await populateGroup(Group.findOne({ inviteToken: req.params.token, isDeleted: false }));
    if (!group) return res.status(404).json({ success: false, message: 'Invite not found' });

    res.json({
      success: true,
      group: {
        _id: group._id,
        name: group.name,
        memberCount: group.members.length,
        admin: group.admin,
        settings: group.settings,
        alreadyMember: isMember(group, myId)
      }
    });
  } catch (error) {
    console.error('Invite preview error:', error);
    res.status(500).json({ success: false, message: 'Could not read invite' });
  }
});


// V139: Professional group member search
router.get('/users/search', auth, async (req, res) => {
  try {
    const q = String(req.query.q || req.query.search || '').trim();

    if (!q) return res.json({ success: true, users: [] });

    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(safe, 'i');

    const users = await User.find({
      $or: [
        { username: rx },
        { displayName: rx },
        { name: rx }
      ]
    })
      .select('_id username displayName name avatar profilePhoto photo bio isVerified')
      .limit(12);

    res.json({
      success: true,
      users: users.map(user => ({
        _id: user._id,
        username: user.username,
        displayName: user.displayName || user.name || user.username,
        avatar: user.avatar || user.profilePhoto || user.photo || '',
        bio: user.bio || '',
        isVerified: Boolean(user.isVerified)
      }))
    });
  } catch (error) {
    console.error('V139 user search error:', error);
    res.status(500).json({ success: false, message: 'Could not search users' });
  }
});


router.get('/:groupId', auth, async (req, res) => {
  try {
    const myId = uid(req);
    const group = await populateGroup(Group.findOne({ _id: req.params.groupId, isDeleted: false }));

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (!isMember(group, myId)) return res.status(403).json({ success: false, message: 'You are not a member of this group' });

    const serialized = serializeGroup(group, myId);

    res.json({
      success: true,
      group: serialized,
      messages: (serialized.messages || []).slice(-200)
    });
  } catch (error) {
    console.error('Group thread error:', error);
    res.status(500).json({ success: false, message: 'Could not load group' });
  }
});

router.post('/:groupId/messages', auth, async (req, res) => {
  try {
    const myId = uid(req);
    let group = await Group.findOne({ _id: req.params.groupId, isDeleted: false });

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (!isMember(group, myId)) return res.status(403).json({ success: false, message: 'You are not a member of this group' });

    if (group.settings?.adminOnlyMessages && !isAdmin(group, myId)) {
      return res.status(403).json({ success: false, message: 'Only admin can send messages in this group' });
    }

    const body = String(req.body.body || '').trim();
    const media = cleanMedia(req.body.media || []);
    const type = ['text','image','video','audio','file'].includes(req.body.type) ? req.body.type : (media.length ? 'file' : 'text');

    if (!body && !media.length) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    group.messages.push({
      sender: myId,
      body: body || (media.length ? `Shared ${media.length} attachment${media.length > 1 ? 's' : ''}` : ''),
      type,
      media,
      readBy: [{ user: myId, readAt: new Date() }]
    });

    await group.save();
    group = await populateGroup(Group.findById(group._id));

    const serialized = serializeGroup(group, myId);
    const messages = serialized.messages || [];

    res.status(201).json({
      success: true,
      message: 'Group message sent',
      data: messages[messages.length - 1],
      group: serialized
    });
  } catch (error) {
    console.error('Send group message error:', error);
    res.status(500).json({ success: false, message: 'Could not send group message' });
  }
});

router.patch('/:groupId/read', auth, async (req, res) => {
  try {
    const myId = uid(req);
    const group = await Group.findOne({ _id: req.params.groupId, isDeleted: false });

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (!isMember(group, myId)) return res.status(403).json({ success: false, message: 'You are not a member of this group' });

    let changed = 0;

    group.messages.forEach(msg => {
      const senderId = String(msg.sender?._id || msg.sender);
      if (senderId === String(myId)) return;

      const already = (msg.readBy || []).some(r => String(r.user?._id || r.user) === String(myId));
      if (!already) {
        msg.readBy.push({ user: myId, readAt: new Date() });
        changed += 1;
      }
    });

    if (changed) await group.save();

    res.json({ success: true, message: 'Group messages marked read', modifiedCount: changed });
  } catch (error) {
    console.error('Read group error:', error);
    res.status(500).json({ success: false, message: 'Could not update group read status' });
  }
});

router.post('/:groupId/invite', auth, async (req, res) => {
  try {
    const myId = uid(req);
    const group = await Group.findOne({ _id: req.params.groupId, isDeleted: false });

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (!isMember(group, myId)) return res.status(403).json({ success: false, message: 'You are not a member of this group' });

    if (!group.inviteToken) {
      group.inviteToken = crypto.randomBytes(18).toString('hex');
      await group.save();
    }

    res.json({ success: true, inviteToken: group.inviteToken });
  } catch (error) {
    console.error('Invite group error:', error);
    res.status(500).json({ success: false, message: 'Could not create invite link' });
  }
});

router.patch('/:groupId', auth, async (req, res) => {
  try {
    const myId = uid(req);
    let group = await Group.findOne({ _id: req.params.groupId, isDeleted: false });

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (!isAdmin(group, myId)) return res.status(403).json({ success: false, message: 'Only admin can manage this group' });

    if (typeof req.body.name === 'string' && req.body.name.trim()) {
      group.name = req.body.name.trim().slice(0, 50);
    }

    if (Array.isArray(req.body.memberUsernames)) {
      const users = await findUsersByUsernames(req.body.memberUsernames);
      const ids = new Set(users.map(user => String(user._id)));
      ids.add(String(group.admin));
      group.members = Array.from(ids);
    }

    if (typeof req.body.adminOnlyMessages === 'boolean') {
      group.settings.adminOnlyMessages = req.body.adminOnlyMessages;
    }

    if (typeof req.body.openJoin === 'boolean') {
      group.settings.openJoin = req.body.openJoin;
    }

    if (typeof req.body.inviteRequired === 'boolean') {
      group.settings.inviteRequired = req.body.inviteRequired;
    }

    await group.save();
    group = await populateGroup(Group.findById(group._id));

    res.json({
      success: true,
      message: 'Group updated',
      group: serializeGroup(group, myId)
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ success: false, message: 'Could not update group' });
  }
});

router.post('/:groupId/leave', auth, async (req, res) => {
  try {
    const myId = uid(req);
    const group = await Group.findOne({ _id: req.params.groupId, isDeleted: false });

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    if (!isMember(group, myId)) return res.status(400).json({ success: false, message: 'You are not in this group' });

    if (isAdmin(group, myId)) {
      group.isDeleted = true;
      await group.save();
      return res.json({ success: true, message: 'Admin deleted the group' });
    }

    group.members = group.members.filter(id => String(id) !== String(myId));
    await group.save();

    res.json({ success: true, message: 'Left group' });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ success: false, message: 'Could not leave group' });
  }
});

module.exports = router;
