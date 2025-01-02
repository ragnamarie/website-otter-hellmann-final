import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const LetterDisplay = styled.div`
  font-size: 40px;
  color: #f6f6f6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw; /* Full viewport width */

  @media (max-width: 750px) {
    font-size: 20px;
  }
`;

export default function TennisWithVideo() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null); // Reference for the video element
  const ballRef = useRef({ x: 50, y: 50, vx: 5, vy: 5 });
  const platformRef = useRef({ x: 100 });
  const ballRadius = 40;
  const platformWidth = 225;
  const platformHeight = 15;

  const [hitCount, setHitCount] = useState(0); // Track number of platform hits
  const [lettersVisible, setLettersVisible] = useState(true); // Track visibility of letters
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
    const video = videoRef.current;

    // Draw video as the background
    if (video && video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // Update ball position
    let newBall = ballRef.current;
    newBall.x += newBall.vx;
    newBall.y += newBall.vy;

    // Check for collisions with walls (left, right, top)
    if (newBall.x - ballRadius <= 0 || newBall.x + ballRadius >= canvas.width) {
      newBall.vx *= -1; // Reverse direction on horizontal walls
    }
    if (newBall.y - ballRadius <= 0) {
      newBall.vy *= -1; // Reverse direction on top wall
    }

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
        return newCount;
      });
    }
    // Reverse direction if the ball hits the bottom of the canvas
    else if (newBall.y + ballRadius > canvas.height) {
      newBall.vy *= -1;
    }

    // Check if hitCount exceeds 29, then move the ball to the center
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
      }

      setTimeout(() => {
        setLettersVisible(false); // Hide letters after 1 second
      }, 1000); // 1-second delay
    }

    // Draw ball
    ctx.fillStyle = "#f6f6f6"; // Ball color remains white even after hitting count exceeds 29
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

    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.error("Error playing the video:", err);
      });
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
      <video
        ref={videoRef}
        src="/breathing.mp4" // Replace with your video file path
        autoPlay
        loop
        muted
        style={{ display: "none" }}
      />
      <canvas ref={canvasRef} />
      <LetterDisplay>{renderLetters()}</LetterDisplay>
    </div>
  );
}
