
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface CateringReview {
  id: number;
  name: string;
  review: string;
  rating: number;
  date: string;
  timestamp: number; // Adding timestamp for auto-hiding functionality
}

export const CateringSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [event, setEvent] = useState('');
  const [guests, setGuests] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState<CateringReview[]>([]);
  const [visibleReviews, setVisibleReviews] = useState<CateringReview[]>([]);
  
  // Load reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('damoneReviews');
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews);
      setReviews(parsedReviews);
    } else {
      // Initial sample reviews
      const initialReviews: CateringReview[] = [
        {
          id: 1,
          name: 'Emily Johnson',
          review: 'Damone catered our wedding and the food was exceptional! All our guests were impressed.',
          rating: 5,
          date: '2023-10-05',
          timestamp: Date.now() - 1000000 // A bit in the past
        },
        {
          id: 2,
          name: 'Michael Chen',
          review: 'Great service for our corporate event. Professional staff and delicious menu options.',
          rating: 4,
          date: '2023-09-22',
          timestamp: Date.now() - 2000000 // A bit more in the past
        },
        {
          id: 3,
          name: 'Sarah Williams',
          review: 'Loved the variety of options for our family reunion. Very accommodating with dietary restrictions.',
          rating: 5,
          date: '2023-08-30',
          timestamp: Date.now() - 3000000 // Even more in the past
        }
      ];
      setReviews(initialReviews);
      localStorage.setItem('damoneReviews', JSON.stringify(initialReviews));
    }
  }, []);

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

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('damoneReviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // In a real app, you would send this data to your backend
    console.log('Catering inquiry submitted:', { name, email, phone, event, guests, date, message });
    
    // Reset form after submission
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setEvent('');
      setGuests('');
      setDate('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  const handleAddReview = () => {
    const newReview: CateringReview = {
      id: Date.now(),
      name: 'Guest User',
      review: 'The catering service was excellent! Would definitely recommend for any event.',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };
    
    setReviews(prev => [newReview, ...prev]);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="catering-section space-y-8">
      <div className="max-w-3xl mx-auto">
        <p className="text-lg mb-6">
          Let us make your next event special with our professional catering services. From intimate gatherings to large celebrations, we offer customized menus to suit your needs.
        </p>
        
        {submitted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Thank you!</strong>
            <span className="block sm:inline"> Your catering inquiry has been submitted. Our team will contact you shortly.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-[#3a3a3a] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Catering Inquiry</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Name*</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:outline-none text-black dark:text-white bg-white dark:bg-[#333]"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Email*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:outline-none text-black dark:text-white bg-white dark:bg-[#333]"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Phone*</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:outline-none text-black dark:text-white bg-white dark:bg-[#333]"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Event Type*</label>
                <select
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:outline-none text-black dark:text-white bg-white dark:bg-[#333]"
                >
                  <option value="">Select Event Type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Number of Guests*</label>
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  required
                  min="1"
                  className="w-full p-2 border rounded focus:ring-2 focus:outline-none text-black dark:text-white bg-white dark:bg-[#333]"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Event Date*</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:outline-none text-black dark:text-white bg-white dark:bg-[#333]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Additional Information</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:outline-none text-black dark:text-white bg-white dark:bg-[#333]"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="bg-[#684b2c] text-white px-6 py-2 rounded-md hover:bg-[#a77e58] transition-colors"
            >
              Submit Inquiry
            </button>
          </form>
        )}
      </div>
      
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Customer Reviews</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleReviews.length > 0 ? (
            visibleReviews.map(review => (
              <div key={review.id} className="bg-white dark:bg-[#3a3a3a] p-4 rounded-md shadow-md">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-black dark:text-white mr-2">{review.name}</span>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{review.review}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{review.date}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-3 text-center">No reviews available. Be the first to leave a review!</p>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={handleAddReview}
            className="mt-4 bg-[#684b2c] text-white px-4 py-2 rounded-md hover:bg-[#a77e58] transition-colors"
          >
            Add Sample Review
          </button>
        </div>
      </div>
    </div>
  );
};
