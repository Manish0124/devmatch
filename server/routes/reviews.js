const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a review
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { revieweeId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = new Review({
      reviewerId: req.userId,
      revieweeId,
      rating,
      comment,
    });

    await review.save();

    // Update user's average rating
    const allReviews = await Review.find({ revieweeId });
    const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);
    
    await User.findByIdAndUpdate(revieweeId, {
      averageRating: parseFloat(avgRating),
      totalReviews: allReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ revieweeId: userId })
      .populate('reviewerId', 'name profileImage');

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({
      reviews,
      averageRating: avgRating,
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews given by current user
router.get('/given/all', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewerId: req.userId })
      .populate('revieweeId', 'name profileImage');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;