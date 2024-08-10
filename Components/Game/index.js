import { useEffect, useRef, useState } from "react";

export default function Game() {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 2, vy: 2 });
  const platformRef = useRef({ x: 100 });
  const ballRadius = 7;
  const platformWidth = 75;
  const platformHeight = 5;

  // State to track if the game is over
  const [gameOver, setGameOver] = useState(false);

  function handleKeyDown(e) {
    if (e.key === "ArrowLeft") {
      platformRef.current.x = Math.max(platformRef.current.x - 20, 0);
    } else if (e.key === "ArrowRight") {
      platformRef.current.x = Math.min(
        platformRef.current.x + 20,
        canvasRef.current.width - platformWidth
      );
    }
  }

  function updateGame() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set background color
    ctx.fillStyle = "#8ACE00"; // brat background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update ball position
    let newBall = ballRef.current;
    newBall.x += newBall.vx;
    newBall.y += newBall.vy;

    // Check for collisions with walls (left, right, top)
    if (newBall.x - ballRadius <= 0 || newBall.x + ballRadius >= canvas.width) {
      newBall.vx *= -1;
    }
    if (newBall.y - ballRadius <= 0) {
      newBall.vy *= -1;
    }

    // Check for collision with the platform
    const platformX = platformRef.current.x;
    const platformY = canvas.height - platformHeight;

    if (
      newBall.y + ballRadius >= platformY && // Ball is at the platform level
      newBall.x >= platformX && // Ball is within the platform's left edge
      newBall.x <= platformX + platformWidth // Ball is within the platform's right edge
    ) {
      newBall.vy *= -1; // Bounce the ball
    } else if (newBall.y + ballRadius > canvas.height) {
      // Ball missed the platform and is "gone"
      setGameOver(true); // Set game over state
      return; // Stop the game loop
    }

    // Draw ball
    ctx.fillStyle = "black"; // black ball
    ctx.beginPath();
    ctx.arc(newBall.x, newBall.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw platform
    ctx.fillStyle = "black"; // black platform
    ctx.fillRect(platformX, platformY, platformWidth, platformHeight);

    // Continue the game loop
    requestAnimationFrame(updateGame);
  }

  useEffect(() => {
    if (canvasRef.current && !gameOver) {
      requestAnimationFrame(updateGame);
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Display "Game Over" message
      ctx.font = "18px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(
        "Game Over, please refresh the page to start again",
        canvas.width / 2,
        canvas.height / 2
      );
    }
  }, [gameOver]);

  return <canvas ref={canvasRef} width="500" height="400" />;
}
