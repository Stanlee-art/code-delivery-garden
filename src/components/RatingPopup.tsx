
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
    <div id="ratingPopup" className={isOpen ? 'show-popup' : ''}>
      <p>Submit your ratings?</p>
      <button id="submitRatings" onClick={onSubmit}>Submit</button>
      <button id="closePopup" onClick={onClose}>Cancel</button>
    </div>
  );
};
