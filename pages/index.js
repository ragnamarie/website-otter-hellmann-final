import { useState, useRef, useEffect } from "react";
import TennisVideo from "@/Components/TennisVideo";
import TennisVideoMobileNoPlatform from "@/Components/TennisVideoMobileNoPlatform";
import Subtitles from "@/Components/Subtitles";

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);
  const [startGame, setStartGame] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const videoRef = useRef(null);
  const triggeredRef = useRef(false);

  const toggleSound = () => setIsMuted((prev) => !prev);

  // 🎬 Trigger at 88s (desktop shows message, mobile doesn't)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (!triggeredRef.current && video.currentTime >= 88) {
        triggeredRef.current = true;

        // Show message (desktop only visually)
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
          setStartGame(true);
        }, 2000);
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  return (
    <>
      {/* Subtitles */}
      <Subtitles isMuted={isMuted} />

      {/* 🎥 Video (NOW ONLY HERE) */}
      <video
        ref={videoRef}
        src="/VideoWithSound.mp4"
        autoPlay
        muted={isMuted}
        playsInline
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* Desktop Game */}
      <div className="desktop-only">
        <TennisVideo startGame={startGame} showMessage={showMessage} />
      </div>

      {/* Mobile Game */}
      <div className="mobile-only">
        <TennisVideoMobileNoPlatform startGame={startGame} />
      </div>

      {/* Top right */}
      <div
        className="top-right-link"
        onClick={() =>
          (window.top.location.href = "https://meikeludwigs.com/about/")
        }
      >
        make it stop
      </div>

      {/* Bottom right */}
      <div className="bottom-right-link" onClick={toggleSound}>
        {isMuted ? "sound on" : "sound off"}
      </div>

      <style jsx>{`
        .desktop-only {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 1;
        }

        .mobile-only {
          position: fixed;
          inset: 0;
          z-index: 1;
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

        .top-right-link {
          position: fixed;
          top: 20px;
          right: 20px;
          color: #e6331b;
          padding: 10px 20px;
          cursor: pointer;
          z-index: 1000;
        }

        .top-right-link:hover {
          color: #ed705f;
        }

        .bottom-right-link {
          position: fixed;
          bottom: 20px;
          right: 20px;
          color: #e6331b;
          padding: 10px 20px;
          cursor: pointer;
          z-index: 1000;
        }

        .bottom-right-link:hover {
          color: #ed705f;
        }

        @media (max-width: 950px) {
          .top-right-link,
          .bottom-right-link {
            font-size: 30px;
          }
        }

        @media (min-width: 951px) {
          .top-right-link,
          .bottom-right-link {
            font-size: 38px;
          }
        }
      `}</style>
    </>
  );
}
