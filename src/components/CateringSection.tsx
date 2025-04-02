
import React, { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';

interface CateringReview {
  id: number;
  rating: number;
  comment: string;
  date: string;
  timestamp: number; // Adding timestamp for auto-hiding functionality
}

export const CateringSection: React.FC = () => {
  const [reviews, setReviews] = useState<CateringReview[]>([]);
  const [visibleReviews, setVisibleReviews] = useState<CateringReview[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  // Load reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('damoneCateringReviews');
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews);
      setReviews(parsedReviews);
    }
  }, []);
  
  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('damoneCateringReviews', JSON.stringify(reviews));
  }, [reviews]);
  
  // Update visible reviews when reviews change
  useEffect(() => {
    // Filter out reviews older than 2 minutes
    const currentTime = Date.now();
    const twoMinutesAgo = currentTime - 2 * 60 * 1000;
    
    const recentReviews = reviews.filter(review => 
      review.timestamp && review.timestamp > twoMinutesAgo
    );
    
    // Only show the 3 most recent reviews
    setVisibleReviews(recentReviews.slice(0, 3));
    
    // Set up an interval to check for expired reviews every 10 seconds
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const twoMinutesAgo = currentTime - 2 * 60 * 1000;
      
      const recentReviews = reviews.filter(review => 
        review.timestamp && review.timestamp > twoMinutesAgo
      );
      
      setVisibleReviews(recentReviews.slice(0, 3));
    }, 10000);
    
    return () => clearInterval(interval);
  }, [reviews]);
  
  const handleRatingClick = (value: number) => {
    setRating(value);
  };
  
  const handleSubmit = () => {
    if (!newReview.trim() || rating === 0) return;
    
    const review: CateringReview = {
      id: Date.now(),
      rating,
      comment: newReview,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };
    
    setReviews(prev => [review, ...prev]);
    setNewReview('');
    setRating(0);
  };

  return (
    <div className="catering-reviews mt-8">
      <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Rate Our Catering Service</h3>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <p className="mr-2 text-black dark:text-white">Your Rating:</p>
          <div className="rating-stars flex">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className="text-2xl cursor-pointer transition-transform"
                style={{ 
                  color: value <= (hoveredRating || rating) ? '#ffcc00' : '#ccc',
                  transform: value <= (hoveredRating || rating) ? 'scale(1.2)' : 'scale(1)'
                }}
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        <Textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Share your experience with our catering service..."
          className="w-full p-3 border rounded-md focus:ring-2 focus:outline-none text-black dark:text-white bg-white dark:bg-[#333]"
          rows={3}
        />
        
        <button 
          onClick={handleSubmit}
          disabled={!newReview.trim() || rating === 0}
          className={`mt-2 px-4 py-2 rounded-md text-white transition-colors ${
            !newReview.trim() || rating === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#684b2c] hover:bg-[#a77e58]'
          }`}
        >
          Submit Review
        </button>
      </div>
      
      <div className="reviews-list space-y-4 mt-6">
        <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Customer Reviews</h3>
        
        {visibleReviews.length > 0 ? (
          visibleReviews.map(review => (
            <div key={review.id} className="bg-white dark:bg-[#3a3a3a] p-4 rounded-md shadow">
              <div className="flex items-center mb-2">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span 
                      key={value} 
                      style={{ color: value <= review.rating ? '#ffcc00' : '#ccc' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">{review.date}</span>
              </div>
              <p className="text-black dark:text-white">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No catering reviews yet. Be the first to review our service!</p>
        )}
      </div>
    </div>
  );
};
