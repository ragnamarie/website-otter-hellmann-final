import { useState, useEffect } from "react";
import styled from "styled-components";

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white;
`;

const Circle = styled.div`
  width: ${(props) => props.radius * 2}px;
  height: ${(props) => props.radius * 2}px;
  border-radius: 50%;
  background-color: #e6e6e6;
`;

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

      const maxRadiusWidth = window.innerWidth / 2; // Maximum radius based on width
      const maxRadiusHeight = window.innerHeight / 2; // Maximum radius based on height

      const update = () => {
        analyser.getByteTimeDomainData(dataArray);
        const volume = Math.max(...dataArray); // Get the loudest signal from the mic

        // Calculate the effective max radius as the minimum of both max dimensions
        const effectiveMaxRadius = Math.min(maxRadiusWidth, maxRadiusHeight);

        // Adjust size based on the current volume level
        if (volume > 130) {
          // Increase size when sound level is high
          setRadius((prevRadius) =>
            Math.min(prevRadius + 2, effectiveMaxRadius)
          ); // Limit to effective max radius
        } else {
          // Gradually shrink size when there's little or no sound
          setRadius((prevRadius) => Math.max(prevRadius - 1, 5)); // Keep min radius
        }

        requestAnimationFrame(update);
      };

      update();
    };

    navigator.mediaDevices.getUserMedia({ audio: true }).then(handleSuccess);
  }, []);

  return (
    <Background>
      <Circle radius={radius} />
    </Background>
  );
}
