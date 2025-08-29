import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

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
  z-index: 2; /* ✅ put letters above canvas */
  pointer-events: auto; /* ✅ allow clicks */
`;

export default function TennisWithRedirect() {
  const canvasRef = useRef(null);
  const ballRef = useRef({ x: 50, y: 50, vx: 3, vy: 3 });
  const platformRef = useRef({ x: 100 });
  const platformWidth = 150;
  const platformHeight = 30;

  // ⭕ radius is dynamic now
  const ballRadiusRef = useRef(40);

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
    if (
      newBall.x - ballRadiusRef.current <= 0 ||
      newBall.x + ballRadiusRef.current >= canvas.width
    ) {
      newBall.vx *= -1;
    }
    if (newBall.y - ballRadiusRef.current <= 0 && newBall.y > 0) {
      newBall.vy *= -1;
    }
    if (newBall.y + ballRadiusRef.current >= canvas.height) {
      newBall.vy *= -1;
    }

    const platformX = platformRef.current.x;
    const platformY = canvas.height - platformHeight - 100;

    // Platform collision
    if (
      newBall.y + ballRadiusRef.current >= platformY &&
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

    // 🎯 Game Over behavior
    if (hitCountRef.current > 29) {
      // ⭕ Smooth shrink radius toward 13
      if (ballRadiusRef.current > 13) {
        ballRadiusRef.current -= 0.5; // shrink speed
        if (ballRadiusRef.current < 13) ballRadiusRef.current = 13;
      }

      const dotXRatio = 0.56;
      const dotYRatio = 0.43;
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

    // 🟠 Draw ball
    ctx.fillStyle = "#e6331b";
    ctx.beginPath();
    ctx.arc(newBall.x, newBall.y, ballRadiusRef.current, 0, Math.PI * 2);
    ctx.fill();

    // 🟠 Draw platform (red → white after game ends)
    if (hitCountRef.current > 29) {
      ctx.fillStyle = "#ffffff";
    } else {
      ctx.fillStyle = "#e6331b";
    }
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
      }, 1000);

      return () => clearTimeout(whiteScreenTimer);
    }, 2000);

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
        ballRef.current.y = ballRadiusRef.current + 1;
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
            fontSize: "65px",
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
            {hitCount > 0 && lettersVisible && (
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
        </>
      )}
    </div>
  );
}
