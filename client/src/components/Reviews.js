import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reviews.css';

const Reviews = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/${userId}`);
      setReviews(response.data.reviews);
      setAvgRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/reviews/create',
        {
          revieweeId: userId,
          rating,
          comment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRating(5);
      setComment('');
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h3>Reviews & Ratings</h3>
        <div className="rating-summary">
          <div className="rating-score">
            <span className="score">{avgRating}</span>
            <span className="out-of">/5.0</span>
          </div>
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.floor(avgRating) ? 'filled' : ''}`}>
                ★
              </span>
            ))}
          </div>
          <p className="review-count">({totalReviews} reviews)</p>
        </div>

        {!showForm && (
          <button className="leave-review-btn" onClick={() => setShowForm(true)}>
            Leave a Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="form-group">
            <label>Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star-input ${rating >= star ? 'selected' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submitting} className="submit-btn">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet</p>
        ) : (
          reviews.map((review, idx) => (
            <div key={idx} className="review-item">
              <div className="review-header">
                {review.reviewerId.profileImage && (
                  <img 
                    src={review.reviewerId.profileImage} 
                    alt={review.reviewerId.name}
                    className="reviewer-avatar"
                  />
                )}
                <div className="reviewer-info">
                  <h4>{review.reviewerId.name}</h4>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {review.comment && <p className="review-comment">{review.comment}</p>}
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;