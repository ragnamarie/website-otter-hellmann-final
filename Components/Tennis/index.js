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

export default function Tennis() {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 5, vy: 5 });
  const platformRef = useRef({ x: 100 });
  const ballRadius = 40;
  const platformWidth = 225;
  const platformHeight = 15;

  const [hitCount, setHitCount] = useState(0); // Track number of platform hits
  const letters = "THE   ART   OF    BEING HUMAN      "; // Word to reveal
  console.log(hitCount);

  function handleKeyDown(e) {
    if (e.key === "ArrowLeft") {
      platformRef.current.x = Math.max(platformRef.current.x - 75, 0);
    } else if (e.key === "ArrowRight") {
      platformRef.current.x = Math.min(
        platformRef.current.x + 75,
        canvasRef.current.width - platformWidth
      );
    }
  }

  function updateGame() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set background color
    ctx.fillStyle = "#e0ff9e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      setHitCount((prevCount) => Math.min(prevCount + 6, letters.length));
    }
    // Reverse direction if the ball hits the bottom of the canvas
    else if (newBall.y + ballRadius > canvas.height) {
      newBall.vy *= -1;
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
        ballRef.current.x = canvas.width / 2; // Reset ball to center
        ballRef.current.y = canvas.height / 4;
        platformRef.current.x = (canvas.width - platformWidth) / 2;
      }
    };

    resizeCanvas(); // Set initial canvas size

    if (canvasRef.current) {
      requestAnimationFrame(updateGame);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", resizeCanvas); // Update on window resize
    }

    // Cleanup event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Function to render the letters based on hitCount
  const renderLetters = () => {
    if (hitCount > 0) {
      return <h1>{letters.substring(0, hitCount)}</h1>;
    }
    return null;
  };

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <canvas ref={canvasRef} />
      {/* Render letters based on hitCount */}
      <LetterDisplay>{renderLetters()}</LetterDisplay>
    </div>
  );
}
