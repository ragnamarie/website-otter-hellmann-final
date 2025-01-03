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
  font-size: 40px;
  color: #f6f6f6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw; /* Full viewport width */
  opacity: ${(props) => (props.fadeOut ? 0 : 1)};
  animation: ${(props) => (props.fadeOut ? fadeOut : "none")} 1s forwards;

  @media (max-width: 750px) {
    font-size: 20px;
  }
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0; // Ensure video is below the canvas
  animation: ${fadeIn} 3s forwards; // Apply fade-in animation when video is shown
`;

export default function TennisWithVideo() {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 5, vy: 5 });
  const platformRef = useRef({ x: 100 });
  const ballRadius = 40;
  const platformWidth = 225;
  const platformHeight = 15;

  const [hitCount, setHitCount] = useState(0); // Track number of platform hits
  const [lettersVisible, setLettersVisible] = useState(true); // Track visibility of letters
  const [showVideo, setShowVideo] = useState(false); // Track if video should be shown
  const [fadeOutLetters, setFadeOutLetters] = useState(false); // Track fade-out animation
  const letters = "THE   ART   OF    BEING HUMAN      "; // Word to reveal
  const hitCountRef = useRef(0); // Store hitCount using ref

  function handleTrackpadMove(event) {
    event.preventDefault(); // Prevent default trackpad swipe gestures

    const moveAmount = -event.deltaX; // Horizontal movement from the trackpad
    const newPlatformX = platformRef.current.x + moveAmount;

    // Ensure the platform stays within the canvas bounds
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

    // Check for collisions with walls (left, right, top)
    if (newBall.x - ballRadius <= 0 || newBall.x + ballRadius >= canvas.width) {
      newBall.vx *= -1; // Reverse direction on horizontal walls
    }
    if (newBall.y - ballRadius <= 0) {
      newBall.vy *= -1; // Reverse direction on the top wall
    }
    if (newBall.y + ballRadius >= canvas.height) {
      newBall.vy *= -1; // Reverse direction on the bottom wall
    }

    // Ensure the ball stays within canvas bounds (optional safeguard)
    newBall.x = Math.max(
      ballRadius,
      Math.min(newBall.x, canvas.width - ballRadius)
    );
    newBall.y = Math.max(
      ballRadius,
      Math.min(newBall.y, canvas.height - ballRadius)
    );

    // Check for collision with the platform
    const platformX = platformRef.current.x;
    const platformY = canvas.height - platformHeight - 100;

    if (
      newBall.y + ballRadius >= platformY &&
      newBall.x >= platformX &&
      newBall.x <= platformX + platformWidth
    ) {
      newBall.vy *= -1;

      // Increment hit count when the ball hits the platform
      setHitCount((prevCount) => {
        const newCount = Math.min(prevCount + 6, letters.length);
        hitCountRef.current = newCount; // Update the ref with the new count

        // Trigger fade-out animation when hitCount exceeds 29
        if (newCount > 29 && lettersVisible) {
          setTimeout(() => setFadeOutLetters(true), 800); // Start fade-out animation
          setTimeout(() => setLettersVisible(false), 1800); // Hide letters after fade-out
        }

        return newCount;
      });
    }

    // Move the ball to the center when hitCount exceeds 29
    if (hitCountRef.current > 29) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const dx = centerX - newBall.x;
      const dy = centerY - newBall.y;

      const speed = 0.03; // Adjust speed for smoother movement
      newBall.vx = dx * speed;
      newBall.vy = dy * speed;

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        newBall.x = centerX;
        newBall.y = centerY;
        newBall.vx = 0;
        newBall.vy = 0;

        setShowVideo(true); // Show video when the ball reaches the center
      }
    }

    // Draw ball
    ctx.fillStyle = "#f6f6f6";
    ctx.beginPath();
    ctx.arc(newBall.x, newBall.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();

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

    resizeCanvas(); // Set initial canvas size

    if (canvasRef.current) {
      requestAnimationFrame(updateGame);
      window.addEventListener("resize", resizeCanvas); // Update on window resize
      window.addEventListener("wheel", handleTrackpadMove, { passive: false }); // Trackpad gesture control
    }

    // Cleanup event listeners
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
      {showVideo && (
        <Video
          src="/breathing.mp4" // Replace with your video file path
          autoPlay
          muted
        />
      )}
      <canvas ref={canvasRef} style={{ zIndex: 1, position: "relative" }} />
      <LetterDisplay fadeOut={fadeOutLetters}>{renderLetters()}</LetterDisplay>
    </div>
  );
}
