const express = require('express');
const Match = require('../models/Match');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Like/Dislike a user
router.post('/swipe', authMiddleware, async (req, res) => {
  try {
    const { swipedUserId, liked } = req.body;

    const match = new Match({
      userId: req.userId,
      swipedUserId,
      liked,
    });

    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get matches (mutual likes)
router.get('/matches', authMiddleware, async (req, res) => {
  try {
    const userMatches = await Match.find({
      userId: req.userId,
      liked: true,
    }).populate('swipedUserId', '-password');

    const matches = await Match.find({
      swipedUserId: req.userId,
      liked: true,
      userId: { $in: userMatches.map(m => m.swipedUserId._id) },
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;