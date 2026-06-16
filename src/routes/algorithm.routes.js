const express = require('express');
const router = express.Router();

let auth = require('../middleware/auth');
if (auth && typeof auth !== 'function') {
  auth = auth.auth || auth.protect || auth.requireAuth || auth.verifyToken || auth.default;
}
if (typeof auth !== 'function') {
  throw new Error('Auth middleware not found. Check src/middleware/auth.js export.');
}

const {
  recordInteraction,
  recommendedFeed,
  recommendedProfiles,
  recommendedClips,
  trending
} = require('../services/recommendation.service');

function currentUserId(req) {
  return req.user?.id || req.user?._id || req.userId || req.auth?.userId || req.decoded?.id;
}

function requireUser(req, res) {
  const userId = currentUserId(req);
  if (!userId) {
    res.status(401).json({ success: false, message: 'Login required for recommendations.' });
    return null;
  }
  return userId;
}

router.post('/event', auth, async (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const event = await recordInteraction(userId, req.body);
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/feed', auth, async (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const posts = await recommendedFeed(userId, req.query);
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/profiles', auth, async (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const profiles = await recommendedProfiles(userId, req.query);
    res.json({ success: true, profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/clips', auth, async (req, res) => {
  try {
    const userId = requireUser(req, res);
    if (!userId) return;

    const clips = await recommendedClips(userId, req.query);
    res.json({ success: true, clips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/trends', auth, async (req, res) => {
  try {
    requireUser(req, res);
    const data = await trending(req.query);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
