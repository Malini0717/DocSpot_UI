// src/components/VideoPlayer.js
import React, { useEffect, useRef, forwardRef } from 'react';

const VideoPlayer = forwardRef(({ isSpeaking }, ref) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isSpeaking) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isSpeaking]);

  // Pass reference to parent if needed
  useEffect(() => {
    if (ref) {
      ref.current = videoRef.current;
    }
  }, [ref]);

  return (
    <video
      ref={videoRef}
      className="doctor-video-player"
      src="/doctor.mp4"
      muted
      playsInline
      preload="auto"
      style={{ width: '100%', height: 'auto' }}
    />
  );
});

export default VideoPlayer;
