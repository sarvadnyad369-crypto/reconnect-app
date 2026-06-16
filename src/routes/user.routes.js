const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// V137: Professional user search for group member picker
router.get('/search', auth, async (req, res) => {
  try {
    const q = String(req.query.q || req.query.search || '').trim();
    if (!q) return res.json({ success: true, users: [] });

    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

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
    console.error('User search error:', error);
    res.status(500).json({ success: false, message: 'Could not search users' });
  }
});


module.exports = router;
