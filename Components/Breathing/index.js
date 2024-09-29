import React, { useState, useEffect } from "react";

export default function Breathing() {
  const [radius, setRadius] = useState(50);

  useEffect(() => {
    const handleSuccess = (stream) => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 2048;

      microphone.connect(analyser);

      const update = () => {
        analyser.getByteTimeDomainData(dataArray);
        const volume = Math.max(...dataArray); // Get the loudest signal from the mic

        // Adjust size based on the current volume level
        if (volume > 130) {
          // Increase size when sound level is high
          setRadius((prevRadius) => Math.min(prevRadius + 2, 500)); // Add max radius
        } else {
          // Gradually shrink size when there's little or no sound
          setRadius((prevRadius) => Math.max(prevRadius - 1, 5)); // Add min radius
        }

        requestAnimationFrame(update);
      };

      update();
    };

    navigator.mediaDevices.getUserMedia({ audio: true }).then(handleSuccess);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          borderRadius: "50%",
          backgroundColor: "#e6e6e6",
        }}
      />
    </div>
  );
}
