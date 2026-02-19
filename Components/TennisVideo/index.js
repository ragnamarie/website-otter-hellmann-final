import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeOut = keyframes`
  to {
    opacity: 0;
  }
`;

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

export default function TennisVideo({ muted }) {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 3, vy: 3 });
  const platformRef = useRef({ x: 100 });

  const platformWidth = 180;
  const platformHeight = 30;
  const ballRadiusRef = useRef(40);

  const [hitCount, setHitCount] = useState(0);
  const [lettersVisible] = useState(true);
  const [fadeOutLetters] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const letters = "the   art   of    be\u0131ng human      ";

  const hitCountRef = useRef(0);
  const pongSoundRef = useRef(null);
  const firstHitRef = useRef(false);
  const triggeredRef = useRef(false);
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
    if (!canvas || canvas.width === 0) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ball = ballRef.current;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collisions
    if (
      ball.x - ballRadiusRef.current <= 0 ||
      ball.x + ballRadiusRef.current >= canvas.width
    ) {
      ball.vx *= -1;
    }
    if (ball.y - ballRadiusRef.current <= 0 && ball.y > 0) {
      ball.vy *= -1;
    }
    if (ball.y + ballRadiusRef.current >= canvas.height) {
      ball.vy *= -1;
    }

    const platformX = platformRef.current.x;
    const platformY = canvas.height - platformHeight - 100;

    const platformRect = {
      x: platformX,
      y: platformY,
      width: platformWidth,
      height: platformHeight,
    };

    const closestX = Math.max(
      platformRect.x,
      Math.min(ball.x, platformRect.x + platformRect.width)
    );
    const closestY = Math.max(
      platformRect.y,
      Math.min(ball.y, platformRect.y + platformRect.height)
    );

    const dx = ball.x - closestX;
    const dy = ball.y - closestY;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared <= ballRadiusRef.current * ballRadiusRef.current) {
      if (Math.abs(dx) > Math.abs(dy)) {
        ball.vx *= -1;
        ball.x += dx > 0 ? 5 : -5;
      } else {
        ball.vy *= -1;
        ball.y += dy > 0 ? 5 : -5;

        if (dy < 0 && ball.vy < 0) {
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
      }
    }

    // Final convergence logic
    if (hitCountRef.current > 29) {
      if (ballRadiusRef.current > 13) {
        ballRadiusRef.current -= 0.5;
        if (ballRadiusRef.current < 13) ballRadiusRef.current = 13;
      }

      const centerX = canvas.width * 0.56;
      const centerY = canvas.height * 0.43;

      const dx = centerX - ball.x;
      const dy = centerY - ball.y;
      const speed = 0.03;

      ball.vx = dx * speed;
      ball.vy = dy * speed;

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        ball.x = centerX;
        ball.y = centerY;
        ball.vx = 0;
        ball.vy = 0;
        gameRunningRef.current = false; // 🛑 END GAME
      }
    }

    // Draw
    ctx.fillStyle = "#e6331b";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadiusRef.current, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = hitCountRef.current > 29 ? "#ffffff" : "#e6331b";
    ctx.fillRect(platformX, platformY, platformWidth, platformHeight);

    requestAnimationFrame(updateGame);
  }

  // 🎬 Trigger at 88s
  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) return;

    const onTimeUpdate = () => {
      if (!triggeredRef.current && video.currentTime >= 88) {
        triggeredRef.current = true;
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
          setStartGame(true);
        }, 2000);
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  // 🎾 Init game (canvas already exists)
  useEffect(() => {
    if (!startGame) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ballRef.current.x = canvas.width / 2;
      ballRef.current.y = ballRadiusRef.current + 1;
      platformRef.current.x = (canvas.width - platformWidth) / 2;
    };

    resizeCanvas();

    gameRunningRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(updateGame);
    });

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("wheel", handleTrackpadMove, { passive: false });

    return () => {
      gameRunningRef.current = false;
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("wheel", handleTrackpadMove);
    };
  }, [startGame]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Video */}
      <video
        src="https://ohs0219-2026.web.app/VideoWithSound.mp4"
        autoPlay
        muted={muted}
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* Start message */}
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

      {/* Canvas always mounted */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "transparent",
          opacity: startGame ? 1 : 0,
          pointerEvents: startGame ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Letters */}
      <LetterDisplay fadeOut={fadeOutLetters}>
        {startGame && hitCount > 0 && lettersVisible && (
          <a
            href="https://meikeludwigs.com/about"
            style={{
              textDecoration: "none",
              color: "#e6331b",
              cursor: "pointer",
            }}
          >
            <h1>{letters.substring(0, hitCount)}</h1>
          </a>
        )}
      </LetterDisplay>
    </div>
  );
}
