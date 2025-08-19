import { useState, useEffect, useRef } from "react";
import TennisVideo from "@/Components/TennisVideo";
import TennisVideoMobileNoPlatform from "@/Components/TennisVideoMobileNoPlatform";

export default function HomePage() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio once
  useEffect(() => {
    const audio = new Audio("/Sound.mp4");
    audio.muted = false;
    audioRef.current = audio;

    // Clean up on unmount
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Pause/resume audio on tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.visibilityState === "hidden") {
        audio.pause();
      } else if (document.visibilityState === "visible" && isAudioPlaying) {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAudioPlaying]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsAudioPlaying(true);
    }
  };

  return (
    <>
      <div className="desktop-only">
        <TennisVideo />
      </div>
      <div className="mobile-only">
        <TennisVideoMobileNoPlatform />
      </div>

      {/* Sound toggle */}
      <div className="sound-toggle" onClick={toggleAudio}>
        {isAudioPlaying ? "sound off" : "sound on"}
      </div>

      <a className="top-right-link" href="https://meikeludwigs.com/about/">
        make it stop
      </a>

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

        .sound-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          color: red;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 36px;
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
          color: red;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 36px;
          cursor: pointer;
          z-index: 1000;
          user-select: none;
        }
        .top-right-link:hover {
          color: white;
        }
      `}</style>
    </>
  );
}
