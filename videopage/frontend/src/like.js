import React, { useState } from 'react';
import './like.css';
function VideoActions() {
  const [liked, setLiked] = useState(false); // State for like
  const [disliked, setDisliked] = useState(false); // State for dislike

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false); // Ensure dislike is toggled off
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false); // Ensure like is toggled off
  };

  return (
    <div className="video-actions">
      <button
        className={`like-button ${liked ? 'active' : ''}`}
        onClick={handleLike}
      >
        👍
      </button>
      <button
        className={`dislike-button ${disliked ? 'active' : ''}`}
        onClick={handleDislike}
      >
        👎
      </button>
    </div>
  );
}

export default VideoActions;
