
import React, { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';

interface Comment {
  id: number;
  text: string;
  date: string;
  timestamp: number; // Adding timestamp for auto-hiding functionality
}

export const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [visibleComments, setVisibleComments] = useState<Comment[]>([]);

  // Load comments from localStorage on component mount
  useEffect(() => {
    const savedComments = localStorage.getItem('damoneComments');
    if (savedComments) {
      const parsedComments = JSON.parse(savedComments);
      setComments(parsedComments);
    }
  }, []);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('damoneComments', JSON.stringify(comments));
  }, [comments]);

  // Update visible comments when comments change
  useEffect(() => {
    // Filter out comments older than 2 minutes
    const currentTime = Date.now();
    const twoMinutesAgo = currentTime - 2 * 60 * 1000;
    
    const recentComments = comments.filter(comment => 
      comment.timestamp && comment.timestamp > twoMinutesAgo
    );
    
    // Only show the 3 most recent comments
    setVisibleComments(recentComments.slice(0, 3));
    
    // Set up an interval to check for expired comments every 10 seconds
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const twoMinutesAgo = currentTime - 2 * 60 * 1000;
      
      const recentComments = comments.filter(comment => 
        comment.timestamp && comment.timestamp > twoMinutesAgo
      );
      
      setVisibleComments(recentComments.slice(0, 3));
    }, 10000);
    
    return () => clearInterval(interval);
  }, [comments]);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      text: newComment,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="comment-section mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Customer Comments</h2>
      <div className="mb-4">
        <Textarea
          id="commentBox"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Leave your comment..."
          className="w-full p-3 border rounded-md focus:ring-2 focus:outline-none text-black dark:text-white bg-white dark:bg-[#333]"
          rows={3}
        />
        <button 
          onClick={handleSubmit}
          className="mt-2 bg-[#684b2c] text-white px-4 py-2 rounded-md hover:bg-[#a77e58] transition-colors"
        >
          Submit
        </button>
      </div>
      
      <div className="space-y-4 mt-6" id="commentsList">
        {visibleComments.length > 0 ? (
          visibleComments.map(comment => (
            <div key={comment.id} className="bg-white dark:bg-[#3a3a3a] p-4 rounded-md shadow">
              <p className="mb-2 text-black dark:text-white">{comment.text}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Posted on {comment.date}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">Be the first to leave a comment!</p>
        )}
      </div>
    </section>
  );
};
