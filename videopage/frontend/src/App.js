import React, { useState, useEffect } from 'react';
import './App.css';
import VideoPlayer from './video'; // Import the VideoPlayer component
import VideoActions from './like';
function App() {
  const [showButton, setShowButton] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); // Track selected video
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(''); // Track selected video title

  // Initialize screen dimensions state
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scroll to top
    });
  };

  // Use useEffect to update the dimensions when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const videos = [
    { id: 1, title: 'Video 1', thumbnail: `https://picsum.photos/${screenWidth}/${screenHeight}.jpg`, url: '/vid1.mp4' },
    { id: 2, title: 'Video 2', thumbnail: `https://picsum.photos/${screenWidth}/${screenHeight}.jpg`, url: '/vid2.mp4' },
    { id: 3, title: 'Video 3', thumbnail: `https://picsum.photos/${screenWidth}/${screenHeight}.jpg`, url: '/vid3.mp4' },
    { id: 4, title: 'Video 4', thumbnail: `https://picsum.photos/${screenWidth}/${screenHeight}.jpg`, url: '/vid4.mp4' },
    { id: 5, title: 'Video 5', thumbnail: `https://picsum.photos/${screenWidth}/${screenHeight}.jpg`, url: '/vid5.mp4' },
    { id: 6, title: 'Video 6', thumbnail: `https://picsum.photos/${screenWidth}/${screenHeight}.jpg`, url: '/vid6.mp4' },
    { id: 7, title: 'Video 7', thumbnail: `https://picsum.photos/${screenWidth}/${screenHeight}.jpg`, url: '/vid7.mp4' },
    { id: 8, title: 'Video 8', thumbnail: `https://picsum.photos/${screenWidth}/${screenHeight}.jpg`, url: '/vid8.mp4' },
    { id: 9, title: 'Video 9', thumbnail: `https://picsum.photos/${screenWidth}/${screenHeight}.jpg`, url: '/vid9.mp4' },
    { id: 10, title: 'Video 10', thumbnail: `https://picsum.photos/${screenWidth}/${screenHeight}.jpg`, url: '/vid10.mp4' },
  ];

  const handleVideoClick = (url, title) => {
    setSelectedVideo(url); // Set the selected video URL
    setSelectedVideoTitle(title); // Set the selected video title
  };

  return (
    <div className="App">
      <header className="header">
        <img
          src="TUBIFY.png"
          alt="Logo"
          className="logo"
        />
        <span className="logo-text">TUBIFY</span>
        <div id="poza"></div>
      </header>

      {/* Main Content Section */}
      <div className="main-content">
        {/* Video Thumbnails Column */}
        <div className="video-thumbnails">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="thumbnail"
                onClick={() => handleVideoClick(video.url, video.title)} // Pass video URL and title
              />
              <p className="video-title">{video.title}</p>
            </div>
          ))}
        </div>

        {/* Render Video Player */}
        {selectedVideo && (
          <VideoPlayer
            videoUrl={selectedVideo}
            title={selectedVideoTitle} // Pass the dynamic title
          />
        )}
          
      </div>

      {/* Back to Top button */}
      {showButton && (
        <button className="back-to-top" onClick={scrollToTop}>↑</button>
      )}
      <div className="like">
      {/* Your video player and other components */}
      
      {/* Include the VideoActions component */}
      <VideoActions />
      </div>
    </div>
    
  );
}

export default App;
