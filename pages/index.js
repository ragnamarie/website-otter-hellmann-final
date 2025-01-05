import { useState, useEffect } from "react";
import TennisVideo from "@/Components/TennisVideo";
import TennisVideoMobileTilt from "@/Components/TennisVideoMobileTilt";

export default function HomePage() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);

  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true; // Set audio to loop
    setAudioInstance(audio);

    // Clean up the audio instance when the component unmounts
    return () => {
      if (audio) {
        audio.pause();
        audio.src = ""; // Clear the audio source to free up resources
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audioInstance) {
      if (isAudioPlaying) {
        audioInstance.pause();
      } else {
        audioInstance
          .play()
          .catch((error) => console.error("Audio playback failed:", error));
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  return (
    <>
      <div className="desktop-only">
        <TennisVideo />
      </div>
      <div className="mobile-only">
        <TennisVideoMobileTilt />
      </div>

      {/* Sound toggle */}
      <div className="sound-toggle" onClick={toggleAudio}>
        {isAudioPlaying ? "SOUND OFF" : "SOUND ON"}
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

        .sound-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 12px;
          cursor: pointer;
          z-index: 1000;
          user-select: none;
        }

        .sound-toggle:hover {
          color: black;
        }
      `}</style>
    </>
  );
}
