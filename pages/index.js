import { useState, useRef, useEffect } from "react";
import TennisVideo from "@/Components/TennisVideo";
import TennisVideoMobileNoPlatform from "@/Components/TennisVideoMobileNoPlatform";

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (videoRef.current) {
        if (document.hidden) {
          videoRef.current.pause(); // pause when leaving tab
        } else {
          videoRef.current.play().catch(() => {}); // resume when coming back
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <>
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        className="background-video"
      >
        <source src="/VideoForBackground.mp4" type="video/mp4" />
      </video>

      {/* Page Content */}
      <div className="desktop-only">
        <TennisVideo />
      </div>

      <div className="mobile-only">
        <TennisVideoMobileNoPlatform />
      </div>

      {/* Mute toggle */}
      <div className="sound-toggle" onClick={toggleMute}>
        {isMuted ? "sound on" : "sound off"}
      </div>

      <div
        className="top-right-link"
        onClick={() => {
          window.top.location.href = "https://meikeludwigs.com/about/";
        }}
      >
        make it stop
      </div>

      <style jsx>{`
        .background-video {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
        }

        .desktop-only {
          display: none;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 950px) {
          .desktop-only {
            display: none;
          }
          .mobile-only {
            display: block;
          }
        }

        @media (min-width: 951px) {
          .desktop-only {
            display: block;
          }
          .mobile-only {
            display: none;
          }
        }

        .sound-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          color: #e6331b;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 65px;
          cursor: pointer;
          z-index: 1000;
          user-select: none;
        }

        .sound-toggle:hover {
          color: white;
        }

        .top-right-link {
          position: fixed;
          top: 20px;
          right: 20px;
          color: #e6331b;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 65px;
          cursor: pointer;
          z-index: 1000;
          user-select: none;
        }

        .top-right-link:hover {
          color: white;
        }

        /* Desktop */
        @media (min-width: 951px) {
          .top-right-link {
            font-size: 65px;
          }
          .sound-toggle {
            font-size: 65px;
          }
        }

        /* Mobile */
        @media (max-width: 950px) {
          .top-right-link {
            font-size: 30px;
          }
          .sound-toggle {
            font-size: 30px;
          }
        }
      `}</style>
    </>
  );
}
