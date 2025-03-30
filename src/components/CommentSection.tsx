
import React, { useState, useEffect } from 'react';

interface Comment {
  id: number;
  text: string;
  date: string;
}

export const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  // Load comments from localStorage on component mount
  useEffect(() => {
    const savedComments = localStorage.getItem('damoneComments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('damoneComments', JSON.stringify(comments));
  }, [comments]);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      text: newComment,
      date: new Date().toLocaleDateString()
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Comments</h2>
      <div className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave your comment..."
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 focus:outline-none"
          rows={3}
        />
        <button 
          onClick={handleSubmit}
          className="mt-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Submit
        </button>
      </div>
      
      <div className="space-y-4 mt-6">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="bg-card p-4 rounded-md shadow">
              <p className="mb-2">{comment.text}</p>
              <p className="text-sm text-muted-foreground">Posted on {comment.date}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground italic">Be the first to leave a comment!</p>
        )}
      </div>
    </section>
  );
};
