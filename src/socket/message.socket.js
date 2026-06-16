const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const messaging = require('../services/messaging.service');

const onlineUsers = new Map();

function getToken(socket) {
  const authToken = socket.handshake.auth?.token;
  const header = socket.handshake.headers?.authorization || '';
  if (authToken) return authToken;
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

async function socketAuth(socket, next) {
  try {
    const token = getToken(socket);
    if (!token) return next(new Error('Login required'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id || decoded.userId || decoded.sub;
    if (!userId) return next(new Error('Invalid token'));

    const user = await User.findById(userId).select('-password -passwordHash');
    if (!user) return next(new Error('User not found'));

    socket.user = user;
    socket.userId = String(user._id);
    return next();
  } catch (error) {
    return next(new Error('Login required'));
  }
}

async function joinUserConversations(socket) {
  const conversations = await Conversation.find({
    'participants.user': socket.userId,
    isDeleted: false
  }).select('_id');

  conversations.forEach(conversation => {
    socket.join(`conversation:${conversation._id}`);
  });
}

function emitPresence(io, userId, isOnline) {
  io.emit('presence:update', {
    userId,
    isOnline,
    at: new Date().toISOString()
  });
}

module.exports = function registerMessagingSocket(io) {
  io.use(socketAuth);

  io.on('connection', async (socket) => {
    const userId = socket.userId;

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    socket.join(`user:${userId}`);
    await joinUserConversations(socket);
    emitPresence(io, userId, true);

    socket.emit('messaging:ready', {
      success: true,
      userId,
      socketId: socket.id
    });

    socket.on('conversation:join', async (conversationId, callback) => {
      try {
        await messaging.getConversation(userId, conversationId);
        socket.join(`conversation:${conversationId}`);
        callback?.({ success: true });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });

    socket.on('conversation:leave', (conversationId, callback) => {
      socket.leave(`conversation:${conversationId}`);
      callback?.({ success: true });
    });

    socket.on('message:send', async (payload = {}, callback) => {
      try {
        const conversationId = payload.conversationId;
        const message = await messaging.sendMessage(userId, conversationId, payload);
        io.to(`conversation:${conversationId}`).emit('message:new', { message });
        callback?.({ success: true, message });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });

    socket.on('message:read', async (payload = {}, callback) => {
      try {
        const result = await messaging.markRead(userId, payload.conversationId);
        io.to(`conversation:${payload.conversationId}`).emit('message:read', {
          conversationId: payload.conversationId,
          userId,
          readAt: result.readAt
        });
        callback?.({ success: true, ...result });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });

    socket.on('typing:start', async (payload = {}) => {
      const conversationId = payload.conversationId;
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit('typing:start', {
        conversationId,
        userId,
        user: socket.user,
        at: new Date().toISOString()
      });
    });

    socket.on('typing:stop', (payload = {}) => {
      const conversationId = payload.conversationId;
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit('typing:stop', {
        conversationId,
        userId,
        at: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          emitPresence(io, userId, false);
        }
      }
    });
  });
};
