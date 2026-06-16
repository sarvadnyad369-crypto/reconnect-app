const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

const authorFields = '_id displayName username avatar isVerified followers following blockedUsers mutedUsers';

function uid(req) {
  return req.user._id || req.user.id || req.user.userId;
}

async function createNotification({ recipient, actor, type, post = null, text = '' }) {
  if (!recipient || !actor) return;
  if (String(recipient) === String(actor)) return;

  await Notification.create({
    recipient,
    actor,
    type,
    post,
    text,
    isRead: false
  });
}

router.get('/feed', auth, async (req, res) => {
  try {
    const me = await User.findById(uid(req)).select('blockedUsers mutedUsers');

    const blocked = (me?.blockedUsers || []).map(id => String(id));
    const muted = (me?.mutedUsers || []).map(id => String(id));

    const posts = await Post.find({ visibility: 'public' })
      .sort({ createdAt: -1 })
      .populate('author', authorFields)
      .populate('comments.author', '_id displayName username avatar isVerified')
      .limit(150);

    const filtered = posts.filter(post => {
      const authorId = String(post.author?._id || post.author || '');
      return !blocked.includes(authorId) && !muted.includes(authorId);
    });

    res.json({ success: true, posts: filtered });
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ success: false, message: 'Could not load feed' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const content = String(req.body.content || '').trim();
    const mood = String(req.body.mood || 'Thought').trim() || 'Thought';
    const media = Array.isArray(req.body.media) ? req.body.media.slice(0, 4) : [];

    if (!content && !media.length) {
      return res.status(400).json({ success: false, message: 'Post content or media required' });
    }

    const post = await Post.create({
      author: uid(req),
      content: content || `Shared ${media.length} media file${media.length > 1 ? 's' : ''}`,
      mood,
      media,
      visibility: 'public'
    });

    const populated = await Post.findById(post._id)
      .populate('author', authorFields)
      .populate('comments.author', '_id displayName username avatar isVerified');

    res.status(201).json({ success: true, message: 'Post created', post: populated });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Could not create post' });
  }
});

router.post('/:postId/like', auth, async (req, res) => {
  try {
    const meId = uid(req);
    const post = await Post.findById(req.params.postId).populate('author', authorFields);

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.likes = post.likes || [];
    const already = post.likes.some(id => String(id) === String(meId));

    if (already) {
      post.likes = post.likes.filter(id => String(id) !== String(meId));
    } else {
      post.likes.push(meId);

      const actor = await User.findById(meId).select('_id displayName username');

      await createNotification({
        recipient: post.author._id || post.author,
        actor: meId,
        type: 'like',
        post: post._id,
        text: `${actor?.displayName || actor?.username || 'Someone'} liked your post: ${(post.content || '').slice(0, 80)}`
      });
    }

    await post.save();

    const populated = await Post.findById(post._id)
      .populate('author', authorFields)
      .populate('comments.author', '_id displayName username avatar isVerified');

    res.json({
      success: true,
      message: already ? 'Post unliked' : 'Post liked',
      liked: !already,
      post: populated
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ success: false, message: 'Could not update like' });
  }
});

router.post('/:postId/comment', auth, async (req, res) => {
  try {
    const text = String(req.body.text || '').trim();

    if (!text) return res.status(400).json({ success: false, message: 'Comment text required' });

    const meId = uid(req);
    const post = await Post.findById(req.params.postId).populate('author', authorFields);

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({
      author: meId,
      text,
      createdAt: new Date()
    });

    await post.save();

    const actor = await User.findById(meId).select('_id displayName username');

    await createNotification({
      recipient: post.author._id || post.author,
      actor: meId,
      type: 'comment',
      post: post._id,
      text: `${actor?.displayName || actor?.username || 'Someone'} commented: ${text.slice(0, 120)}`
    });

    const populated = await Post.findById(post._id)
      .populate('author', authorFields)
      .populate('comments.author', '_id displayName username avatar isVerified');

    res.json({ success: true, message: 'Comment added', post: populated });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ success: false, message: 'Could not add comment' });
  }
});

router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (String(post.author) !== String(uid(req))) {
      return res.status(403).json({ success: false, message: 'You can delete only your own post' });
    }

    await post.deleteOne();

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, message: 'Could not delete post' });
  }
});

module.exports = router;
