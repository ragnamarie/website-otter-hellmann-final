import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const LetterDisplay = styled.div`
  font-size: 4vw;
  color: #e6331b;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  opacity: ${(props) => (props.fadeOut ? 0 : 1)};
  animation: ${(props) => (props.fadeOut ? fadeOut : "none")} 1s forwards;
`;

export default function TennisWithRedirect() {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 3, vy: 3 });
  const platformRef = useRef({ x: 100 });
  const ballRadius = 15;
  const platformWidth = 150;
  const platformHeight = 30;

  const [hitCount, setHitCount] = useState(0);
  const [lettersVisible, setLettersVisible] = useState(true);
  const [fadeOutLetters, setFadeOutLetters] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const letters = "the   art   of    be\u0131ng human      ";
  const hitCountRef = useRef(0);
  const pongSoundRef = useRef(null);
  const firstHitRef = useRef(false);

  useEffect(() => {
    pongSoundRef.current = new Audio("/PONG.wav");
    pongSoundRef.current.preload = "auto";
  }, []);

  function handleTrackpadMove(event) {
    event.preventDefault();
    const moveAmount = -event.deltaX;
    const newPlatformX = platformRef.current.x + moveAmount;
    platformRef.current.x = Math.max(
      0,
      Math.min(newPlatformX, canvasRef.current.width - platformWidth)
    );
  }

  function updateGame() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let newBall = ballRef.current;
    newBall.x += newBall.vx;
    newBall.y += newBall.vy;

    // Wall collisions
    if (newBall.x - ballRadius <= 0 || newBall.x + ballRadius >= canvas.width) {
      newBall.vx *= -1;
    }
    if (newBall.y - ballRadius <= 0 && newBall.y > 0) {
      newBall.vy *= -1;
    }
    if (newBall.y + ballRadius >= canvas.height) {
      newBall.vy *= -1;
    }

    const platformX = platformRef.current.x;
    const platformY = canvas.height - platformHeight - 100;

    // Platform collision
    if (
      newBall.y + ballRadius >= platformY &&
      newBall.x >= platformX &&
      newBall.x <= platformX + platformWidth &&
      newBall.vy > 0
    ) {
      newBall.vy *= -1;

      if (!firstHitRef.current) {
        newBall.vx *= 2;
        newBall.vy *= 2;
        firstHitRef.current = true;
      }

      if (pongSoundRef.current) {
        pongSoundRef.current.currentTime = 0;
        pongSoundRef.current.play().catch(() => {});
      }

      setHitCount((prevCount) => {
        const newCount = Math.min(prevCount + 6, letters.length);
        hitCountRef.current = newCount;
        return newCount;
      });
    }

    // Redirect logic
    if (hitCountRef.current > 29) {
      const centerX = canvas.width / 2 + canvas.width * 0.046;
      const centerY = canvas.height / 2 - canvas.height * 0.047;

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
        window.location.href = "https://meikeludwigs.com/about";
      }
    }

    // Draw ball
    ctx.fillStyle = "#e6331b";
    ctx.beginPath();
    ctx.arc(newBall.x, newBall.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw platform
    ctx.fillStyle = "#e6331b";
    ctx.fillRect(platformX, platformY, platformWidth, platformHeight);

    requestAnimationFrame(updateGame);
  }

  const renderLetters = () => {
    if (hitCount > 0 && lettersVisible) {
      return <h1>{letters.substring(0, hitCount)}</h1>;
    }
    return null;
  };

  // Show "start to play" after video, then white screen, then start game
  useEffect(() => {
    if (!videoFinished) return;

    setShowMessage(true);

    const messageTimer = setTimeout(() => {
      setShowMessage(false);

      const whiteScreenTimer = setTimeout(() => {
        setStartGame(true);
      }, 1000); // 1 second white screen

      return () => clearTimeout(whiteScreenTimer);
    }, 2000); // 2 seconds message

    return () => clearTimeout(messageTimer);
  }, [videoFinished]);

  // Initialize game only after startGame is true
  useEffect(() => {
    if (!startGame) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ballRef.current.x = canvas.width / 2;
        ballRef.current.y = ballRadius + 1;
        platformRef.current.x = (canvas.width - platformWidth) / 2;
      }
    };

    resizeCanvas();

    if (canvasRef.current) {
      requestAnimationFrame(updateGame);
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("wheel", handleTrackpadMove, { passive: false });
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("wheel", handleTrackpadMove);
    };
  }, [startGame]);

  return (
    <div
      style={{
        position: "relative",
        textAlign: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      {!videoFinished && (
        <video
          src="/Video.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoFinished(true)}
          style={{ width: "100%", height: "100vh", objectFit: "cover" }}
        />
      )}

      {showMessage && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "36px",
            color: "#e6331b",
          }}
        >
          start to play
        </div>
      )}

      {startGame && (
        <>
          <canvas ref={canvasRef} style={{ zIndex: 1, position: "relative" }} />
          <LetterDisplay fadeOut={fadeOutLetters}>
            {renderLetters()}
          </LetterDisplay>
        </>
      )}
    </div>
  );
}
