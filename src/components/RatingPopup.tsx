
import React from 'react';

interface RatingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const RatingPopup: React.FC<RatingPopupProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-lg font-medium mb-4 text-center">Submit your ratings?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
