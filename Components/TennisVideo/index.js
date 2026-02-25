import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const LetterDisplay = styled.div`
  font-size: 4vw;
  color: #e6331b;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  z-index: 2;
  display: flex;
  justify-content: center;
  text-align: center;
`;

export default function TennisVideo({ startGame, showMessage }) {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 3, vy: 3 });
  const platformRef = useRef({ x: 100 });

  const platformWidth = 180;
  const platformHeight = 30;
  const ballRadiusRef = useRef(40);

  const [hitCount, setHitCount] = useState(0);

  const letters = "the   art   of    be\u0131ng human      ";

  const hitCountRef = useRef(0);
  const pongSoundRef = useRef(null);
  const firstHitRef = useRef(false);
  const gameRunningRef = useRef(false);

  useEffect(() => {
    pongSoundRef.current = new Audio("/PONG.wav");
    pongSoundRef.current.preload = "auto";
  }, []);

  function handleTrackpadMove(event) {
    if (!gameRunningRef.current) return;
    event.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const moveAmount = -event.deltaX;
    const newPlatformX = platformRef.current.x + moveAmount;

    platformRef.current.x = Math.max(
      0,
      Math.min(newPlatformX, canvas.width - platformWidth)
    );
  }

  function updateGame() {
    if (!gameRunningRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ball = ballRef.current;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (
      ball.x - ballRadiusRef.current <= 0 ||
      ball.x + ballRadiusRef.current >= canvas.width
    ) {
      ball.vx *= -1;
    }

    if (ball.y - ballRadiusRef.current <= 0) {
      ball.vy *= -1;
    }

    if (ball.y + ballRadiusRef.current >= canvas.height) {
      ball.vy *= -1;
    }

    const platformX = platformRef.current.x;
    const platformY = canvas.height - platformHeight - 100;

    const closestX = Math.max(
      platformX,
      Math.min(ball.x, platformX + platformWidth)
    );
    const closestY = Math.max(
      platformY,
      Math.min(ball.y, platformY + platformHeight)
    );

    const dx = ball.x - closestX;
    const dy = ball.y - closestY;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared <= ballRadiusRef.current * ballRadiusRef.current) {
      ball.vy *= -1;

      if (!firstHitRef.current) {
        ball.vx *= 2;
        ball.vy *= 2;
        firstHitRef.current = true;
      }

      if (pongSoundRef.current) {
        pongSoundRef.current.currentTime = 0;
        pongSoundRef.current.play().catch(() => {});
      }

      setHitCount((prev) => {
        const next = Math.min(prev + 6, letters.length);
        hitCountRef.current = next;
        return next;
      });
    }

    if (hitCountRef.current > 29) {
      if (ballRadiusRef.current > 13) {
        ballRadiusRef.current -= 0.5;
      }

      const centerX = canvas.width * 0.56;
      const centerY = canvas.height * 0.43;

      const dx = centerX - ball.x;
      const dy = centerY - ball.y;

      ball.vx = dx * 0.03;
      ball.vy = dy * 0.03;
    }

    ctx.fillStyle = "#e6331b";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadiusRef.current, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = hitCountRef.current > 29 ? "#ffffff" : "#e6331b";
    ctx.fillRect(platformX, platformY, platformWidth, platformHeight);

    requestAnimationFrame(updateGame);
  }

  useEffect(() => {
    if (!startGame) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ballRef.current.x = canvas.width / 2;
    ballRef.current.y = ballRadiusRef.current + 1;
    platformRef.current.x = (canvas.width - platformWidth) / 2;

    gameRunningRef.current = true;
    requestAnimationFrame(updateGame);

    window.addEventListener("wheel", handleTrackpadMove, { passive: false });

    return () => {
      gameRunningRef.current = false;
      window.removeEventListener("wheel", handleTrackpadMove);
    };
  }, [startGame]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {showMessage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "65px",
            color: "#e6331b",
            zIndex: 3,
          }}
        >
          start to play
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: startGame ? 1 : 0,
        }}
      />

      <LetterDisplay>
        {startGame && hitCount > 0 && (
          <a
            href="https://meikeludwigs.com/about"
            style={{
              textDecoration: "none",
              color: "#e6331b",
            }}
          >
            <h1>{letters.substring(0, hitCount)}</h1>
          </a>
        )}
      </LetterDisplay>
    </div>
  );
}
