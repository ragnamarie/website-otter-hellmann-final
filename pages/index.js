import { useState } from "react";
import TennisVideo from "@/Components/TennisVideo";
import TennisVideoMobileNoPlatform from "@/Components/TennisVideoMobileNoPlatform";
import Subtitles from "@/Components/Subtitles";

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <>
      {/* Page Content */}
      <div className="desktop-only">
        <TennisVideo />
      </div>

      <div className="mobile-only">
        <TennisVideoMobileNoPlatform />
      </div>

      {/* Subtitles (bottom center, above video) */}
      <div className="subtitles-container">
        <Subtitles />
      </div>

      {/* Sound toggle */}
      <div className="sound-toggle" onClick={toggleMute}>
        {isMuted ? "sound on" : "sound off"}
      </div>

      {/* Top right link */}
      <div
        className="top-right-link"
        onClick={() => {
          window.top.location.href = "https://meikeludwigs.com/about/";
        }}
      >
        make it stop
      </div>

      <style jsx>{`
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

        /* Subtitles fixed at bottom above video */
        .subtitles-container {
          position: fixed;
          bottom: 100px; /* adjust height above sound toggle */
          width: 100%;
          text-align: center;
          z-index: 900;
          pointer-events: none; /* subtitles don't block clicking */
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

        @media (min-width: 951px) {
          .top-right-link {
            font-size: 65px;
          }
          .sound-toggle {
            font-size: 65px;
          }
        }

        @media (max-width: 950px) {
          .top-right-link {
            font-size: 30px;
          }
          .sound-toggle {
            font-size: 30px;
          }
      `}</style>
    </>
  );
}
