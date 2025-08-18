import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

// Fade-in animation for the video
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LetterDisplay = styled.div`
  font-size: 15px;
  color: #e6331b;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  animation: ${fadeIn} 3s forwards;
`;

export default function TennisVideoMobileNoPlatform() {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 4, vy: 4 });
  const ballRadius = 20;

  const [hitCount, setHitCount] = useState(0);
  const [lettersVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const letters = "the   art   of    being human      ";
  const hitCountRef = useRef(0);

  // 🔊 Sound effect
  const pongSoundRef = useRef(null);

  useEffect(() => {
    pongSoundRef.current = new Audio("/pong.wav");
  }, []);

  function playPongSound() {
    if (pongSoundRef.current) {
      pongSoundRef.current.currentTime = 0; // restart from beginning
      pongSoundRef.current
        .play()
        .catch((err) => console.warn("Audio play prevented:", err));
    }
  }

  function updateGame() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let newBall = ballRef.current;
    newBall.x += newBall.vx;
    newBall.y += newBall.vy;

    // Wall collisions (X)
    if (newBall.x - ballRadius <= 0 || newBall.x + ballRadius >= canvas.width) {
      newBall.vx *= -1;
      incrementHitCount();
      playPongSound(); // 🔊 play sound
    }

    // Wall collisions (Y)
    if (
      newBall.y - ballRadius <= 0 ||
      newBall.y + ballRadius >= canvas.height
    ) {
      newBall.vy *= -1;
      incrementHitCount();
      playPongSound(); // 🔊 play sound
    }

    // End condition: ball moves to center
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
    ctx.fillStyle = "#e6331b";
    ctx.beginPath();
    ctx.arc(newBall.x, newBall.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(updateGame);
  }

  const incrementHitCount = () => {
    setHitCount((prevCount) => {
      const newCount = Math.min(prevCount + 6, letters.length);
      hitCountRef.current = newCount;
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

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      {showVideo && (
        <Video ref={videoRef} src="/breathing.mp4" autoPlay muted playsInline />
      )}
      <canvas ref={canvasRef} style={{ zIndex: 1, position: "relative" }} />
      <LetterDisplay>{renderLetters()}</LetterDisplay>
    </div>
  );
}
