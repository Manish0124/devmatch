const express = require('express');
const Match = require('../models/Match');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Like/Dislike a user
router.post('/swipe', authMiddleware, async (req, res) => {
  try {
    const { swipedUserId, liked } = req.body;

    // Prevent duplicate swipes
    const existingSwipe = await Match.findOne({
      userId: req.userId,
      swipedUserId,
    });

    if (existingSwipe) {
      return res.status(400).json({ message: 'You have already swiped this user' });
    }

    const match = new Match({
      userId: req.userId,
      swipedUserId,
      liked,
    });

    await match.save();

    // Check if it's a mutual match
    let isMatch = false;
    if (liked) {
      const reverseMatch = await Match.findOne({
        userId: swipedUserId,
        swipedUserId: req.userId,
        liked: true,
      });
      isMatch = !!reverseMatch;
    }

    res.status(201).json({ match, isMatch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get matches (mutual likes)
router.get('/matches', authMiddleware, async (req, res) => {
  try {
    // Find all users that the current user liked
    const userLikes = await Match.find({
      userId: req.userId,
      liked: true,
    });

    const likedUserIds = userLikes.map(m => m.swipedUserId);

    // Find mutual matches (users who also liked the current user back)
    const mutualMatches = await Match.find({
      userId: { $in: likedUserIds },
      swipedUserId: req.userId,
      liked: true,
    }).populate('userId', '-password');

    // Return the matched user profiles
    const matchedUsers = mutualMatches.map(m => m.userId);

    res.json(matchedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;