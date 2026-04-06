"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaRegStar,FaStar } from "react-icons/fa";

export default function Reviews({ productId, productData, onReviewSubmitted }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Fetch reviews
  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/product/${productId}?page=${page}`);
      const data = await response.json();
      
      if (data.data) {
        setReviews(data.data);
        setCurrentPage(data.meta?.current_page || 1);
        setLastPage(data.meta?.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // Check if user can review
  const checkCanReview = async () => {
    try {
      // You might want to create an API endpoint to check if user can review
      // For now, we'll just show the form and let the API handle the validation
      return true;
    } catch (error) {
      return false;
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token'); // or however you store your auth token
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          rating: userReview.rating,
          comment: userReview.comment,
        }),
      });

      const data = await response.json();

      if (data.result) {
        setSuccess(data.message);
        setUserReview({ rating: 0, comment: '' });
        setShowReviewForm(false);
        
        // Refresh reviews
        fetchReviews();
        
        // Call the callback if provided
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        
        // Refresh product data to update rating
        router.refresh();
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Render star rating
  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => onRatingChange(i)}
            className="focus:outline-none"
          >
            {i <= userReview.rating ? (
              <FaStar className="w-6 h-6 text-yellow-400" />
            ) : (
              <FaRegStar className="w-6 h-6 text-gray-300 hover:text-yellow-400" />
            )}
          </button>
        );
      } else {
        stars.push(
          i <= rating ? (
            <FaStar key={i} className="w-4 h-4 text-yellow-400 inline" />
          ) : (
            <FaRegStar key={i} className="w-4 h-4 text-gray-300 inline" />
          )
        );
      }
    }
    return stars;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Reviews Summary */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-semibold text-main mb-2">Customer Reviews</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {renderStars(productData.rating || 0)}
              <span className="ml-2 text-gray-600">
                {productData.rating ? productData.rating.toFixed(1) : '0.0'} out of 5
              </span>
            </div>
            <span className="text-gray-500">
              ({productData.rating_count || 0} reviews)
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-6 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-main mb-4">Write Your Review</h4>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex gap-1">
                {renderStars(5, true, (rating) => 
                  setUserReview({ ...userReview, rating })
                )}
              </div>
              {userReview.rating === 0 && (
                <p className="text-sm text-red-500 mt-1">Please select a rating</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={userReview.comment}
                onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main/50"
                placeholder="Share your experience with this product..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || userReview.rating === 0}
                className="px-6 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setUserReview({ rating: 0, comment: '' });
                  setError('');
                  setSuccess('');
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-main border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      {review.user?.name || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => fetchReviews(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {lastPage}
              </span>
              <button
                onClick={() => fetchReviews(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}