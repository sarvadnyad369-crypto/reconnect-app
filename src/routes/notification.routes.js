const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

function uid(req) {
  return req.user._id || req.user.id || req.user.userId;
}

router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: uid(req) })
      .sort({ createdAt: -1 })
      .populate('actor', '_id displayName username avatar isVerified')
      .populate('post', '_id content mood')
      .limit(100);

    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ success: false, message: 'Could not load notifications' });
  }
});

router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ recipient: uid(req), isRead: false });
    res.json({ success: true, count });
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ success: false, message: 'Could not load unread count' });
  }
});

router.patch('/read', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: uid(req), isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Read notifications error:', error);
    res.status(500).json({ success: false, message: 'Could not mark notifications read' });
  }
});

module.exports = router;
