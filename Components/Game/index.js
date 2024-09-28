import { useEffect, useRef, useState } from "react";

export default function Game() {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 5, vy: 5 });
  const platformRef = useRef({ x: 100 });
  const ballRadius = 40;
  const platformWidth = 200;
  const platformHeight = 15;

  const [gameOver, setGameOver] = useState(false);

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
      newBall.vx *= -1;
    }
    if (newBall.y - ballRadius <= 0) {
      newBall.vy *= -1;
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
    } else if (newBall.y + ballRadius > canvas.height) {
      setGameOver(true);
      return;
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

    if (canvasRef.current && !gameOver) {
      requestAnimationFrame(updateGame);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", resizeCanvas); // Update on window resize
    }

    // Cleanup event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) {
      // Trigger a page refresh when game is over
      window.location.reload();
    }
  }, [gameOver]);

  return <canvas ref={canvasRef} />;
}
