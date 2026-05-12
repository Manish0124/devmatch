const express = require('express');
const User = require('../models/User');
const Match = require('../models/Match');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, skills, interests, location, github, linkedin, profileImage } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, bio, skills, interests, location, github, linkedin, profileImage },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users for swiping (exclude current user and already-swiped users)
router.get('/users', authMiddleware, async (req, res) => {
  try {
    // Find all users already swiped by current user
    const swipedMatches = await Match.find({ userId: req.userId });
    const swipedUserIds = swipedMatches.map(m => m.swipedUserId);

    // Exclude current user and already-swiped users
    const users = await User.find({
      _id: { $ne: req.userId, $nin: swipedUserIds }
    }).select('-password');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;