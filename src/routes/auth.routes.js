const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'reconnect_dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(user) {
  return jwt.sign(
    { userId: user._id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    displayName: user.displayName,
    username: user.username,
    email: user.email || '',
    bio: user.bio || 'New on reConnect.',
    avatar: user.avatar || '🔥',
    isVerified: Boolean(user.isVerified),
    followers: user.followers || [],
    following: user.following || []
  };
}

router.post('/register', async (req, res) => {
  try {
    const displayName = String(req.body.displayName || '').trim();
    const username = String(req.body.username || '').toLowerCase().trim();
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');

    if (!displayName || !username || !password) {
      return res.status(400).json({ success: false, message: 'Display name, username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ $or: [{ username }, ...(email ? [{ email }] : [])] });

    if (exists) {
      return res.status(409).json({ success: false, message: 'Username or email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      displayName,
      username,
      email,
      passwordHash,
      bio: 'New on reConnect.',
      avatar: '🔥'
    });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: publicUser(user)
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Could not create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const username = String(req.body.username || '').toLowerCase().trim();
    const password = String(req.body.password || '');

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    }).select('+passwordHash +password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const storedPassword = user.passwordHash || user.password;

    const isMatch = storedPassword
      ? await bcrypt.compare(password, storedPassword)
      : false;

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = signToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: publicUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Could not login' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const username = String(req.body.username || '').toLowerCase().trim();
    const password = String(req.body.password || '');

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and new password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    }).select('+passwordHash +password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    user.passwordHash = passwordHash;

    if (Object.prototype.hasOwnProperty.call(user, 'password')) {
      user.password = passwordHash;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. Login with your new password.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Could not reset password' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const myId = req.user._id || req.user.id || req.user.userId;
    const user = await User.findById(myId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Login required' });
    }

    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ success: false, message: 'Could not load profile' });
  }
});

router.post('/logout', auth, async (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;
