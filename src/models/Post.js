const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    mood: {
      type: String,
      default: 'Thought',
      trim: true,
      maxlength: 80
    },
    media: [
      {
        url: String,
        type: String,
        name: String,
        size: Number
      }
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: 1000
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    }
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
