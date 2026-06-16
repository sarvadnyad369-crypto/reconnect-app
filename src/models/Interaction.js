const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'view',
        'dwell',
        'like',
        'comment',
        'share',
        'save',
        'follow',
        'profile_view',
        'message',
        'search',
        'open_clip',
        'hide',
        'not_interested'
      ],
      index: true
    },
    targetType: {
      type: String,
      enum: ['post', 'clip', 'profile', 'group', 'hashtag', 'search', 'unknown'],
      default: 'unknown',
      index: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    text: { type: String, trim: true, maxlength: 500 },
    query: { type: String, trim: true, lowercase: true, maxlength: 120 },
    durationMs: { type: Number, min: 0, default: 0 },
    source: { type: String, trim: true, maxlength: 80, default: 'app' },
    weight: { type: Number, default: 1 },
    negative: { type: Boolean, default: false }
  },
  { timestamps: true }
);

interactionSchema.index({ userId: 1, createdAt: -1 });
interactionSchema.index({ tags: 1, createdAt: -1 });
interactionSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
interactionSchema.index({ eventType: 1, createdAt: -1 });

module.exports = mongoose.models.Interaction || mongoose.model('Interaction', interactionSchema);
