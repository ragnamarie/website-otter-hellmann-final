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
  pointer-events: auto;

  display: flex;
  justify-content: center;
  text-align: center;

  h1 {
    margin: 0;
  }
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

export default function TennisVideoMobileNoPlatform({ muted }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const ballRef = useRef({ x: 50, y: 50, vx: 1.2, vy: 1.2 });
  const ballRadiusRef = useRef(40);

  const [hitCount, setHitCount] = useState(0);
  const [startGame, setStartGame] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const letters = "the   art   of    be\u0131ng human      ";
  const hitCountRef = useRef(0);
  const triggeredRef = useRef(false);

  const pongSoundRef = useRef(null);

  /* 🔊 sound */
  useEffect(() => {
    pongSoundRef.current = new Audio("/pong.wav");
    pongSoundRef.current.preload = "auto";
  }, []);

  const playPongSound = () => {
    if (pongSoundRef.current) {
      pongSoundRef.current.currentTime = 0;
      pongSoundRef.current.play().catch(() => {});
    }
  };

  /* 📱 orientation */
  useEffect(() => {
    const handleOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    handleOrientation();
    window.addEventListener("resize", handleOrientation);
    window.addEventListener("orientationchange", handleOrientation);

    return () => {
      window.removeEventListener("resize", handleOrientation);
      window.removeEventListener("orientationchange", handleOrientation);
    };
  }, []);

  /* ⏱️ start game at 88s */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!triggeredRef.current && video.currentTime >= 89) {
        triggeredRef.current = true;
        setStartGame(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  /* 🎮 game loop */
  useEffect(() => {
    if (!startGame) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ballRef.current.x = canvas.width / 2;
      ballRef.current.y = ballRadiusRef.current + 1;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    requestAnimationFrame(updateGame);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [startGame]);

  const incrementHitCount = () => {
    setHitCount((prev) => {
      const next = Math.min(prev + 6, letters.length);
      hitCountRef.current = next;
      return next;
    });
  };

  function updateGame() {
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
      incrementHitCount();
      playPongSound();
    }

    if (
      ball.y - ballRadiusRef.current <= 0 ||
      ball.y + ballRadiusRef.current >= canvas.height
    ) {
      ball.vy *= -1;
      incrementHitCount();
      playPongSound();
    }

    /* 🎯 end animation */
    if (hitCountRef.current > 29) {
      const targetRadius = isLandscape ? 8 : 4;

      if (ballRadiusRef.current > targetRadius) {
        ballRadiusRef.current -= 0.5;
        if (ballRadiusRef.current < targetRadius) {
          ballRadiusRef.current = targetRadius;
        }
      }

      const dotXRatio = isLandscape ? 0.57 : 0.56;
      const dotYRatio = isLandscape ? 0.42 : 0.48;

      const centerX = canvas.width * dotXRatio;
      const centerY = canvas.height * dotYRatio;

      const dx = centerX - ball.x;
      const dy = centerY - ball.y;

      ball.vx = dx * 0.03;
      ball.vy = dy * 0.03;

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        ball.x = centerX;
        ball.y = centerY;
        ball.vx = 0;
        ball.vy = 0;
      }
    }

    ctx.fillStyle = "#e6331b";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadiusRef.current, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(updateGame);
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh", // full viewport height
        overflow: "hidden",
      }}
    >
      {/* 🎥 video always visible */}
      <Video
        ref={videoRef}
        src="/VideoWithSound.mp4"
        autoPlay
        preload="auto"
        muted={muted}
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          willChange: "transform", // GPU hint for smoother rendering
          backfaceVisibility: "hidden", // GPU optimization
        }}
      />

      {/* 🎮 canvas always mounted (no flicker) */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: startGame ? 1 : 0,
          pointerEvents: "none",
        }}
      />

      {/* 🔤 letters */}
      <LetterDisplay style={{ opacity: startGame ? 1 : 0 }}>
        <a
          href="https://meikeludwigs.com/about"
          style={{ color: "#e6331b", textDecoration: "none" }}
        >
          {hitCount > 0 && <h1>{letters.substring(0, hitCount)}</h1>}
        </a>
      </LetterDisplay>
    </div>
  );
}
