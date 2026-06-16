const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['member', 'admin', 'owner'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
    lastReadAt: { type: Date, default: null },
    isMuted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['direct', 'group'], required: true, index: true },
    title: { type: String, trim: true, maxlength: 80, default: '' },
    avatarUrl: { type: String, trim: true, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: { type: [participantSchema], validate: v => Array.isArray(v) && v.length > 0 },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    lastMessageText: { type: String, default: '' },
    lastSender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    lastMessageAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

conversationSchema.index({ 'participants.user': 1, updatedAt: -1 });
conversationSchema.index({ type: 1, 'participants.user': 1 });
conversationSchema.index({ lastMessageAt: -1 });

conversationSchema.methods.hasParticipant = function hasParticipant(userId) {
  const id = String(userId);
  return this.participants.some(p => String(p.user?._id || p.user) === id);
};

conversationSchema.methods.touchLastMessage = function touchLastMessage(message) {
  this.lastMessage = message._id;
  this.lastMessageText = message.deletedForEveryone ? 'Message deleted' : (message.text || message.type || 'Attachment');
  this.lastSender = message.sender;
  this.lastMessageAt = message.createdAt || new Date();
  return this.save();
};

module.exports = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
