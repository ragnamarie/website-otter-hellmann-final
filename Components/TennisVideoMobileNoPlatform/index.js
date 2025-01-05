import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

// Define the fade-out animation for letters
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// Define the fade-in animation for the video
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Styled component for the letter display
const LetterDisplay = styled.div`
  font-size: 15px;
  color: #f6f6f6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw; /* Full viewport width */
  opacity: ${(props) => (props.fadeOut ? 0 : 1)};
  animation: ${(props) => (props.fadeOut ? fadeOut : "none")} 1s forwards;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0; /* Ensure video is below the canvas */
  animation: ${fadeIn} 3s forwards; /* Apply fade-in animation when video is shown */
`;

export default function TennisWithVideo({ isAudioPlaying }) {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 4, vy: 4 });
  const ballImageRef = useRef(null); // Ref for the ball image
  const ballRadius = 20;

  const [hitCount, setHitCount] = useState(0);
  const [lettersVisible, setLettersVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [fadeOutLetters, setFadeOutLetters] = useState(false);
  const letters = "THE   ART   OF    BEING HUMAN      ";
  const hitCountRef = useRef(0);

  // Preload the ball image
  useEffect(() => {
    const ballImage = new Image();
    ballImage.src = "/ball.png"; // Replace with the path to your image
    ballImage.onload = () => {
      ballImageRef.current = ballImage; // Store the loaded image
    };
  }, []);

  function updateGame() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update ball position
    let newBall = ballRef.current;
    newBall.x += newBall.vx;
    newBall.y += newBall.vy;

    // Collision detection with edges
    if (newBall.x - ballRadius <= 0 || newBall.x + ballRadius >= canvas.width) {
      newBall.vx *= -1;
      incrementHitCount();
    }
    if (
      newBall.y - ballRadius <= 0 ||
      newBall.y + ballRadius >= canvas.height
    ) {
      newBall.vy *= -1;
      incrementHitCount();
    }

    // Check for end condition
    if (hitCountRef.current > 29) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const dx = centerX - newBall.x;
      const dy = centerY - newBall.y;

      const speed = 0.03;
      newBall.vx = dx * speed;
      newBall.vy = dy * speed;

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        newBall.x = centerX;
        newBall.y = centerY;
        newBall.vx = 0;
        newBall.vy = 0;

        setShowVideo(true);
      }
    }

    // Draw ball
    if (ballImageRef.current) {
      ctx.drawImage(
        ballImageRef.current,
        newBall.x - ballRadius,
        newBall.y - ballRadius,
        ballRadius * 2,
        ballRadius * 2
      );
    } else {
      ctx.fillStyle = "#f6f6f6";
      ctx.beginPath();
      ctx.arc(newBall.x, newBall.y, ballRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(updateGame);
  }

  const incrementHitCount = () => {
    setHitCount((prevCount) => {
      const newCount = Math.min(prevCount + 6, letters.length);
      hitCountRef.current = newCount;

      if (newCount > 29 && lettersVisible) {
        setTimeout(() => setFadeOutLetters(true), 800);
        setTimeout(() => setLettersVisible(false), 1800);
      }

      return newCount;
    });
  };

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ballRef.current.x = canvas.width / 2;
        ballRef.current.y = canvas.height / 4;
      }
    };

    resizeCanvas();

    if (canvasRef.current) {
      requestAnimationFrame(updateGame);
      window.addEventListener("resize", resizeCanvas);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const renderLetters = () => {
    if (hitCount > 0 && lettersVisible) {
      return <h1>{letters.substring(0, hitCount)}</h1>;
    }
    return null;
  };

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isAudioPlaying; // Sync mute state with sound toggle
      if (isAudioPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Video playback failed:", error);
        });
      }
    }
  }, [isAudioPlaying]);

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      {showVideo && (
        <Video ref={videoRef} src="/breathing.mp4" autoPlay muted playsInline />
      )}
      <canvas ref={canvasRef} style={{ zIndex: 1, position: "relative" }} />
      <LetterDisplay fadeOut={fadeOutLetters}>{renderLetters()}</LetterDisplay>
    </div>
  );
}
