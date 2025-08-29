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

export default function TennisVideoMobileNoPlatform() {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 3, vy: 3 });

  // ⭕ dynamic radius (starts at 40, shrinks down depending on orientation)
  const ballRadiusRef = useRef(40);

  const [hitCount, setHitCount] = useState(0);
  const [lettersVisible] = useState(true);
  const [videoFinished, setVideoFinished] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const letters = "the   art   of    be\u0131ng human      ";
  const hitCountRef = useRef(0);

  // 🔊 Sound effect
  const pongSoundRef = useRef(null);

  useEffect(() => {
    pongSoundRef.current = new Audio("/pong.wav");
    pongSoundRef.current.preload = "auto";
  }, []);

  function playPongSound() {
    if (pongSoundRef.current) {
      pongSoundRef.current.currentTime = 0;
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
    if (
      newBall.x - ballRadiusRef.current <= 0 ||
      newBall.x + ballRadiusRef.current >= canvas.width
    ) {
      newBall.vx *= -1;
      incrementHitCount();
      playPongSound();
    }

    // Wall collisions (Y)
    if (
      newBall.y - ballRadiusRef.current <= 0 ||
      newBall.y + ballRadiusRef.current >= canvas.height
    ) {
      newBall.vy *= -1;
      incrementHitCount();
      playPongSound();
    }

    // ✅ End condition: shrink + move to dot
    if (hitCountRef.current > 29) {
      // pick shrink target based on orientation
      const targetRadius = isLandscape ? 6 : 3;

      // Smooth shrink radius toward target
      if (ballRadiusRef.current > targetRadius) {
        ballRadiusRef.current -= 0.5; // shrink rate
        if (ballRadiusRef.current < targetRadius) {
          ballRadiusRef.current = targetRadius;
        }
      }

      // 🎯 Final position depends on orientation
      const dotXRatio = isLandscape ? 0.59 : 0.56;
      const dotYRatio = isLandscape ? 0.44 : 0.48;

      const centerX = canvas.width * dotXRatio;
      const centerY = canvas.height * dotYRatio;

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
      }
    }

    // 🎾 Draw ball
    ctx.fillStyle = "#e6331b";
    ctx.beginPath();
    ctx.arc(newBall.x, newBall.y, ballRadiusRef.current, 0, Math.PI * 2);
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

  // Handle orientation detection
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

  // Start game only after video finished
  useEffect(() => {
    if (!videoFinished) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ballRef.current.x = canvas.width / 2;
        ballRef.current.y = ballRadiusRef.current + 1; // start from top
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
  }, [videoFinished]);

  const renderLetters = () => {
    if (hitCount > 0 && lettersVisible) {
      return <h1>{letters.substring(0, hitCount)}</h1>;
    }
    return null;
  };

  return (
    <div
      style={{
        position: "relative",
        textAlign: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* ✅ Video before game */}
      {!videoFinished && (
        <Video
          src="/Video.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoFinished(true)}
        />
      )}

      {/* 🎮 Game + letters after video finished */}
      {videoFinished && (
        <>
          <canvas ref={canvasRef} style={{ zIndex: 1, position: "relative" }} />
          <LetterDisplay>
            <a
              href="https://meikeludwigs.com/about"
              style={{ color: "#e6331b", textDecoration: "none" }}
            >
              {renderLetters()}
            </a>
          </LetterDisplay>
        </>
      )}
    </div>
  );
}
