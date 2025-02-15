import React from 'react';
import './video.css';

const VideoPlayer = ({ videoUrl, title }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        zIndex: 10,
      }}
    >
      <video
        src={videoUrl}
        controls
        autoPlay
        style={{
          width: '900px',
          height: 'auto',
          border: '2px solid black',
        }}
      />
      <h2
        style={{
          color: 'white',
          textAlign: 'center',
          marginTop: '10px',
        }}
      >
        {title}
      </h2>
    </div>
  );
};

export default VideoPlayer;
