
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

export const CateringSection: React.FC = () => {
  const [reviews, setReviews] = useState<Array<{id: string, name: string, text: string, date: string, visible: boolean}>>([
    { id: '1', name: 'Corporate Event', text: 'The team catered our company event for 200 people. Everything was perfect!', date: '2023-03-15', visible: true },
    { id: '2', name: 'Wedding Reception', text: 'They made our special day even more magical with their delicious food.', date: '2023-03-20', visible: true },
    { id: '3', name: 'Birthday Party', text: 'Our guests couldn't stop talking about how amazing the food was.', date: '2023-03-25', visible: true },
    { id: '4', name: 'Graduation Party', text: 'Fantastic service and presentation. Would hire again!', date: '2023-03-30', visible: true },
    { id: '5', name: 'Family Reunion', text: 'They accommodated our large group with ease and the food was outstanding.', date: '2023-04-01', visible: true }
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    guestCount: '',
    eventType: '',
    message: ''
  });
  
  useEffect(() => {
    // Initialize visibility to show only the first 3 reviews
    const initializedReviews = reviews.map((review, index) => ({
      ...review,
      visible: index < 3
    }));
    setReviews(initializedReviews);
    
    // Set up auto-hiding timer for reviews
    const hideReviewsInterval = setInterval(() => {
      setReviews(prevReviews => {
        // Get all visible reviews
        const visibleReviews = prevReviews.filter(r => r.visible);
        
        // If there are more than 3 visible reviews, hide the oldest one
        if (visibleReviews.length > 3) {
          const reviewToHide = visibleReviews[0].id;
          return prevReviews.map(review => 
            review.id === reviewToHide ? {...review, visible: false} : review
          );
        }
        return prevReviews;
      });
    }, 120000); // 2 minutes = 120000ms
    
    return () => clearInterval(hideReviewsInterval);
  }, []);
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Catering inquiry submitted:', formData);
    // Here you would typically send the data to a server
    alert('Thank you for your inquiry! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      guestCount: '',
      eventType: '',
      message: ''
    });
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Our Catering Services</h3>
        <p className="mb-3">
          We offer full-service catering for events of all sizes. From corporate lunches to wedding receptions, 
          our team will work with you to create a memorable culinary experience.
        </p>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            {reviews.filter(review => review.visible).map((review) => (
              <Card 
                key={review.id} 
                className={`catering-review-container ${review.visible ? '' : 'hidden'} bg-white dark:bg-gray-700 shadow`}
              >
                <CardContent className="p-4">
                  <h4 className="font-bold">{review.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                  <p className="mt-2">{review.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Request a Quote</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block mb-1">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventDate" className="block mb-1">Event Date</label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleFormChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label htmlFor="guestCount" className="block mb-1">Guest Count</label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleFormChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="eventType" className="block mb-1">Event Type</label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleFormChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="">Select Event Type</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate Event</option>
              <option value="birthday">Birthday Party</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="message" className="block mb-1">Additional Information</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 min-h-[100px]"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="bg-[#684b2c] hover:bg-[#a77e58] text-white py-2 px-4 rounded"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};
