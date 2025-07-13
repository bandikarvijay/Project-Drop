// src/components/BackgroundVideo.jsx
import React from 'react';
import './BackgroundVideo.css';

const BackgroundVideo = () => {
  return (
    <video autoPlay muted loop playsInline className="background-video">
      <source src="/videos/theme.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BackgroundVideo;
