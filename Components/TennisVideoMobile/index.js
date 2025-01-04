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

export default function TennisWithVideo() {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 6, vy: 6 });
  const platformRef = useRef({ x: 100 });
  const ballImageRef = useRef(null); // Ref for the ball image
  const ballRadius = 20;
  const platformWidth = 100;
  const platformHeight = 10;

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

  function handleTrackpadMove(event) {
    event.preventDefault();

    const moveAmount = -event.deltaX;
    const newPlatformX = platformRef.current.x + moveAmount;

    platformRef.current.x = Math.max(
      0,
      Math.min(newPlatformX, canvasRef.current.width - platformWidth)
    );
  }

  function updateGame() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update ball position
    let newBall = ballRef.current;
    newBall.x += newBall.vx;
    newBall.y += newBall.vy;

    // Collision detection
    if (newBall.x - ballRadius <= 0 || newBall.x + ballRadius >= canvas.width) {
      newBall.vx *= -1;
    }
    if (newBall.y - ballRadius <= 0) {
      newBall.vy *= -1;
    }
    if (newBall.y + ballRadius >= canvas.height) {
      newBall.vy *= -1;
    }

    const platformX = platformRef.current.x;
    const platformY = canvas.height - platformHeight - 50;

    if (
      newBall.y + ballRadius >= platformY &&
      newBall.x >= platformX &&
      newBall.x <= platformX + platformWidth
    ) {
      newBall.vy *= -1;

      setHitCount((prevCount) => {
        const newCount = Math.min(prevCount + 6, letters.length);
        hitCountRef.current = newCount;

        if (newCount > 29 && lettersVisible) {
          setTimeout(() => setFadeOutLetters(true), 800);
          setTimeout(() => setLettersVisible(false), 1800);
        }

        return newCount;
      });
    }

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

    // Draw platform
    ctx.fillStyle = "#f6f6f6";
    ctx.fillRect(platformX, platformY, platformWidth, platformHeight);

    requestAnimationFrame(updateGame);
  }

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ballRef.current.x = canvas.width / 2;
        ballRef.current.y = canvas.height / 4;
        platformRef.current.x = (canvas.width - platformWidth) / 2;
      }
    };

    resizeCanvas();

    if (canvasRef.current) {
      requestAnimationFrame(updateGame);
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("wheel", handleTrackpadMove, { passive: false });
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("wheel", handleTrackpadMove);
    };
  }, []);

  const renderLetters = () => {
    if (hitCount > 0 && lettersVisible) {
      return <h1>{letters.substring(0, hitCount)}</h1>;
    }
    return null;
  };

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      {showVideo && <Video src="/breathing.mp4" autoPlay muted />}
      <canvas ref={canvasRef} style={{ zIndex: 1, position: "relative" }} />
      <LetterDisplay fadeOut={fadeOutLetters}>{renderLetters()}</LetterDisplay>
    </div>
  );
}
