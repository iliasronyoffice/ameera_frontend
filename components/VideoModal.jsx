"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeVideoModal } from "@/store/slices/videoModalSlice";
import Link from "next/link";

export default function VideoModal() {
  const { isOpen, videoItem } = useSelector((state) => state.videoModal);
  const dispatch = useDispatch();
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(8600);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const progressInterval = useRef(null);

  // Handle video playback when modal opens
  useEffect(() => {
    if (isOpen && videoRef.current && videoItem) {
      // Reset states
      setIsVideoReady(false);
      setIsPlaying(false);
      setProgress(0);

      // Load and play video with proper promise handling
      const videoElement = videoRef.current;

      // Set source and load
      if (videoElement.src !== videoItem?.custom_video) {
        videoElement.src = videoItem?.custom_video;
        videoElement.load();
      }

      // Handle play with promise
      const playPromise = videoElement.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video started playing successfully
            setIsPlaying(true);
            setIsVideoReady(true);
          })
          .catch((error) => {
            console.log("Play was prevented:", error);
            // Auto-play was prevented - show play button overlay
            setIsPlaying(false);
            setIsVideoReady(true); // Still show video thumbnail
          });
      }
    }

    // Handle ESC key
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      // Pause video when component unmounts or modal closes
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [isOpen, videoItem]);

  // Update progress bar
  const updateProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(() => {
      if (
        videoRef.current &&
        videoRef.current.duration &&
        !isNaN(videoRef.current.duration)
      ) {
        const value =
          (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(isNaN(value) ? 0 : value);
      }
    }, 100);
  };

  // Handle progress bar change
  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    if (!isNaN(newProgress) && videoRef.current && videoRef.current.duration) {
      setProgress(newProgress);
      const newTime = (newProgress / 100) * videoRef.current.duration;
      if (!isNaN(newTime)) {
        videoRef.current.currentTime = newTime;
      }
    }
  };

  // Manual play function (for when auto-play is blocked)
  const handleManualPlay = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Manual play failed:", error);
          });
      }
    }
  };

  // Close modal
  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      // Clear source to stop any ongoing loading
      videoRef.current.src = "";
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    dispatch(closeVideoModal());
    setProgress(0);
    setIsVideoReady(false);
    setIsPlaying(false);
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle like button
  const handleLike = () => {
    if (!isLiked) {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
    } else {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
    }
  };

  // Handle comment button - Fixed: Added this function
  const handleComment = () => {
    // You can implement comment functionality here
    // For example: open a comment section or show a comment input
    console.log("Comment clicked for video:", videoItem?.name);
    alert("Comment feature coming soon!");
  };

  // Handle share
  const handleShare = async () => {
    const shareData = {
      title: videoItem?.name,
      text: `Check out ${videoItem?.name}`,
      url: `${window.location.origin}/product/${videoItem?.slug}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Rs. 0";
    return price.toString().replace("৳", "Rs.");
  };

  if (!isOpen || !videoItem) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-main/70 z-[99998]"
        onClick={handleClose}
      />

      {/* Modal Popup */}
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <div
          className="relative bg-main rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: "700px",
            maxWidth: "90vw",
            maxHeight: "100vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-main/60 hover:bg-main/80 rounded-full flex items-center justify-center text-white text-xl transition-colors"
          >
            ✕
          </button>

          {/* Video Container */}
          <div className="relative w-full bg-main">
            <video
              ref={videoRef}
              muted={isMuted}
              loop
              playsInline
              className="w-full"
              style={{
                maxHeight: "80vh",
                objectFit: "contain",
                cursor: "pointer",
              }}
              onTimeUpdate={updateProgress}
              onCanPlay={() => setIsVideoReady(true)}
              preload="auto"
              onClick={handleManualPlay}
            >
              <source src={videoItem?.custom_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play Button Overlay (for when auto-play is blocked) */}
            {!isPlaying && isVideoReady && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-main/50 cursor-pointer"
                onClick={handleManualPlay}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-main border-b-[10px] border-b-transparent ml-1"></div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {!isVideoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-main/50">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Progress Bar */}
            {isVideoReady && (
              <div className="absolute top-0 left-0 right-0 px-3 pb-3">
                <input
                  type="range"
                  value={progress || 0}
                  onChange={handleProgressChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full progress-bar"
                  style={{
                    background: `linear-gradient(to right, white 0%, white ${progress || 0}%, #444 ${progress || 0}%, #444 100%)`,
                  }}
                />
              </div>
            )}

            {/* Product Info */}
            <div className="p-4 absolute bottom-8 left-4 rounded-2xl right-0 bg-gradient-to-t from-white/80 to-transparent w-80">
              <Link
                href={`/Products/${videoItem?.slug}`}
                className="block"
                onClick={handleClose}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={videoItem?.thumbnail_image}
                    alt={videoItem?.name}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-white text-sm font-semibold">
                      {videoItem?.name}
                    </h3>
                    <p className="text-white text-base font-bold mt-1">
                      {formatPrice(videoItem?.main_price)}
                    </p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-main text-white rounded-lg font-semibold transition-colors">
                  View Product 🔗
                </button>
              </Link>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="absolute right-3 bottom-20 flex flex-col gap-2">
            {/* <button
              onClick={handleLike}
              className="w-9 h-9 bg-main/60 rounded-full flex flex-col items-center justify-center hover:bg-main/80 transition-colors"
            >
              <span className="text-xl">{isLiked ? "❤️" : "🤍"}</span>
              <span className="text-white text-[10px]">
                {likeCount.toLocaleString()}
              </span>
            </button>

            <button
              onClick={handleComment}
              className="w-9 h-9 bg-main/60 rounded-full flex items-center justify-center hover:bg-main/80 transition-colors"
            >
              <span className="text-white text-lg">💬</span>
            </button> */}

            <button
              onClick={handleShare}
              className="w-9 h-9 bg-main/60 rounded-full flex items-center justify-center hover:bg-main/80 transition-colors"
            >
              <span className="text-white text-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fillRule="evenodd"
                >
                  <g>
                    <path
                      d="M11 2H6a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-5a1 1 0 0 0-2 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5a1 1 0 0 0 0-2zm7.586 2H15a1 1 0 0 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V5.414l-7.293 7.293a1 1 0 0 1-1.414-1.414z"
                      fill="#fff"
                    />
                  </g>
                </svg>
              </span>
            </button>

            <button
              onClick={toggleMute}
              className="w-9 h-9 bg-main/60 rounded-full flex items-center justify-center hover:bg-main/80 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg
                  key="muted"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M11 2L6 7H3c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h3l5 5V2z" />
                  <line x1="22" y1="9" x2="16" y2="15" />
                  <line x1="16" y1="9" x2="22" y2="15" />
                </svg>
              ) : (
                <svg
                  key="unmuted"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M11 2L6 7H3c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h3l5 5V2z" />
                  <path d="M19 8l4 4-4 4" />
                  <path d="M15 12h8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .progress-bar {
          -webkit-appearance: none;
          width: 100%;
          height: 3px;
          border-radius: 5px;
          outline: none;
        }
        .progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        .progress-bar::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}
