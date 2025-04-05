
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

export const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Array<{id: string, name: string, text: string, date: string, visible: boolean}>>([
    { id: '1', name: 'John Doe', text: 'The food was amazing! I especially loved the garlic bread.', date: '2023-04-01', visible: true },
    { id: '2', name: 'Jane Smith', text: 'Great service and atmosphere. Will definitely come back!', date: '2023-04-02', visible: true },
    { id: '3', name: 'Mike Johnson', text: 'The pasta was cooked to perfection. Compliments to the chef!', date: '2023-04-03', visible: true },
    { id: '4', name: 'Sarah Williams', text: 'I recommend the cheesecake, it was divine!', date: '2023-04-04', visible: true },
    { id: '5', name: 'David Brown', text: 'Excellent wine selection to complement the meals.', date: '2023-04-05', visible: true }
  ]);
  const [newComment, setNewComment] = useState({ name: '', text: '' });
  
  useEffect(() => {
    // Initialize visibility to show only the first 3 comments
    const initializedComments = comments.map((comment, index) => ({
      ...comment,
      visible: index < 3
    }));
    setComments(initializedComments);
    
    // Set up auto-hiding timer for comments
    const hideCommentsInterval = setInterval(() => {
      setComments(prevComments => {
        // Get all visible comments
        const visibleComments = prevComments.filter(c => c.visible);
        
        // If there are more than 3 visible comments, hide the oldest one
        if (visibleComments.length > 3) {
          const commentToHide = visibleComments[0].id;
          return prevComments.map(comment => 
            comment.id === commentToHide ? {...comment, visible: false} : comment
          );
        }
        return prevComments;
      });
    }, 120000); // 2 minutes = 120000ms
    
    return () => clearInterval(hideCommentsInterval);
  }, []);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment({ ...newComment, name: e.target.value });
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment({ ...newComment, text: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.name.trim() && newComment.text.trim()) {
      const currentDate = new Date().toISOString().split('T')[0];
      const newCommentObj = {
        id: Date.now().toString(),
        name: newComment.name,
        text: newComment.text,
        date: currentDate,
        visible: true
      };
      
      // Add new comment and show only the latest 3
      setComments(prevComments => {
        const updatedComments = [newCommentObj, ...prevComments];
        return updatedComments.map((comment, index) => ({
          ...comment,
          visible: index < 3
        }));
      });
      
      setNewComment({ name: '', text: '' });
    }
  };
  
  const visibleComments = comments.filter(comment => comment.visible);
  
  return (
    <div className="my-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Customer Comments</h2>
      
      <div className="grid gap-4 mb-6">
        {visibleComments.map((comment) => (
          <Card 
            key={comment.id} 
            className={`comment-container ${comment.visible ? '' : 'hidden'}`}
          >
            <CardContent className="p-4">
              <h3 className="font-bold">{comment.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{comment.date}</p>
              <p className="mt-2">{comment.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Your Name</label>
          <input
            type="text"
            id="name"
            value={newComment.name}
            onChange={handleNameChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label htmlFor="comment" className="block mb-1 font-medium">Your Comment</label>
          <textarea
            id="comment"
            value={newComment.text}
            onChange={handleTextChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 min-h-[100px]"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-[#684b2c] hover:bg-[#a77e58] text-white py-2 px-4 rounded"
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};
