const mongoose = require('mongoose');
const crypto = require('crypto');

const groupMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    body: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file'],
      default: 'text'
    },
    media: [
      {
        url: String,
        type: String,
        name: String,
        size: Number
      }
    ],
    readBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now }
      }
    ],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        emoji: { type: String, default: '❤️' },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
      }
    ],
    settings: {
      adminOnlyMessages: { type: Boolean, default: false },
      inviteRequired: { type: Boolean, default: true },
      openJoin: { type: Boolean, default: false }
    },
    inviteToken: {
      type: String,
      unique: true,
      index: true
    },
    messages: [groupMessageSchema],
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

groupSchema.pre('validate', function(next) {
  if (!this.inviteToken) {
    this.inviteToken = crypto.randomBytes(18).toString('hex');
  }

  const ids = new Set((this.members || []).map(id => String(id)));
  if (this.admin) ids.add(String(this.admin));
  this.members = Array.from(ids);

  next();
});

groupSchema.index({ members: 1, updatedAt: -1 });
groupSchema.index({ admin: 1, updatedAt: -1 });

module.exports = mongoose.model('Group', groupSchema);
