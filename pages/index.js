import { useState } from "react";
import TennisVideo from "@/Components/TennisVideo";
import TennisVideoMobileNoPlatform from "@/Components/TennisVideoMobileNoPlatform";
import Subtitles from "@/Components/Subtitles";

export default function HomePage() {
  // State to control sound
  const [isMuted, setIsMuted] = useState(true);

  // Toggle function
  const toggleSound = () => setIsMuted((prev) => !prev);

  return (
    <>
      {/* Subtitles */}
      <div>
        <Subtitles isMuted={isMuted} />
      </div>

      {/* Page Content */}
      <div className="desktop-only">
        <TennisVideo muted={isMuted} />
      </div>

      <div className="mobile-only">
        <TennisVideoMobileNoPlatform muted={isMuted} />
      </div>

      {/* Top and Bottom right links */}
      <div
        className="top-right-link"
        onClick={() =>
          (window.top.location.href = "https://meikeludwigs.com/about/")
        }
      >
        make it stop
      </div>

      <div className="bottom-right-link" onClick={toggleSound}>
        {isMuted ? "sound on" : "sound off"}
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

        /* Top-right link */
        .top-right-link {
          position: fixed;
          top: 20px;
          right: 20px;
          color: #e6331b;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          z-index: 1000;
          user-select: none;
        }

        .top-right-link:hover {
          color: #ed705f;
        }

        /* Bottom-right link (sound toggle) */
        .bottom-right-link {
          position: fixed;
          bottom: 20px;
          right: 20px;
          color: #e6331b;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          z-index: 1000;
          user-select: none;
        }

        .bottom-right-link:hover {
          color: #ed705f;
        }

        @media (max-width: 950px) {
          .top-right-link {
            font-size: 30px;
          }
          .bottom-right-link {
            font-size: 30px;
          }
        }

        @media (min-width: 951px) {
          .top-right-link {
            font-size: 38px;
          }
          .bottom-right-link {
            font-size: 38px;
          }
        }
      `}</style>
    </>
  );
}
