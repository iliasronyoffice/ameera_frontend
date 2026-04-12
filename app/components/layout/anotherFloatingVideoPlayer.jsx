'use client';

import { useState, useEffect, useRef } from 'react';
import { IoClose, IoContract, IoExpand, IoPlay, IoPause } from 'react-icons/io5';

export default function FloatingVideoPlayer({ videoUrl, productName }) {
    console.log("Video URL received in FloatingVideoPlayer:", videoUrl);    
    console.log("Product Name received in FloatingVideoPlayer:", productName);
    
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  // Auto-play when component mounts
  useEffect(() => {
    if (videoRef.current && isOpen && !isMinimized) {
      videoRef.current.play().catch(error => {
        console.log('Auto-play prevented:', error);
      });
    }
  }, [isOpen, isMinimized]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else if (isMinimized && videoRef.current && isOpen) {
      videoRef.current.play().catch(error => console.log('Play error:', error));
      setIsPlaying(true);
    }
  };

  const closePlayer = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsOpen(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        bg-white rounded-lg shadow-2xl overflow-hidden
        transition-all duration-300
        ${isMinimized ? 'w-48 h-14' : 'w-80 md:w-96'}
        border border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-900 text-white px-3 py-2">
          <span className="text-xs font-medium truncate">
            {isMinimized ? '🎬 Product Video' : `Video: ${productName || 'Product'}`}
          </span>
          <div className="flex items-center gap-2">
            {!isMinimized && (
              <button
                onClick={togglePlay}
                className="hover:text-gray-300 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <IoPause size={14} /> : <IoPlay size={14} />}
              </button>
            )}
            <button
              onClick={toggleMinimize}
              className="hover:text-gray-300 transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <IoExpand size={14} /> : <IoContract size={14} />}
            </button>
            <button
              onClick={closePlayer}
              className="hover:text-gray-300 transition-colors"
              title="Close"
            >
              <IoClose size={14} />
            </button>
          </div>
        </div>

        {/* Video Player */}
        {!isMinimized && (
          <div className="relative bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto max-h-64"
              controls={isHovered}
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        )}

        {/* Minimized indicator */}
        {isMinimized && (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <span className="text-xs text-gray-600">Video playing...</span>
          </div>
        )}
      </div>
    </div>
  );
}