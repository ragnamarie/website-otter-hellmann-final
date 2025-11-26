import { useEffect, useState } from "react";
import styled from "styled-components";

const SubtitleContainer = styled.div`
  color: #e6331b; /* red text */
  font-size: 2vw;
  text-align: center;
  line-height: 1.6;
  max-width: 90%;
  margin: 0 auto;
  pointer-events: none; /* allow clicks to pass through */

  position: fixed;
  top: 50%; /* vertical center */
  left: 50%; /* horizontal center */
  transform: translate(
    -50%,
    -50%
  ); /* perfectly center both vertically and horizontally */

  width: auto; /* let it shrink to fit content */
  z-index: 900;
  transition: opacity 0.5s ease; /* smooth fade */
`;

export default function Subtitles() {
  // Placeholder sentences for now
  const subtitles = [
    "In a world of permanent stimulation, our minds are constantly under attack.",
    "Notifications never stop, social media feeds are endless, and agitation takes hold.",
    "We find ourselves in a dopamine-driven turmoil,",
    "which leaves us feeling empty and aimless,",
    "causing us to stray from the clarity of life and disconnect from ourselves.",
    "Put simply, we lose our focus.",
    "At the same time, an incessant and loud call for improvement dominates our culture:",
    "Find your purpose.",
    "Manifest your dreams.",
    "Become great.",
    "This exaltation of doing over being is a fine representation of the distorted logic that drives our lives.",
    "One that discredits stillness and simplicity.",
    "What are you doing?",
    "is now the question by which our worth is measured.",
    "We simply neglect essential parts of ourselves.",
    "Our hearts long for meaningful connections,",
    "yet we find ourselves pursuing distractions instead,",
    "no time for emotions, expression, or assimilation.",
    "But there is another way,",
    "and it is time to step out of the hamster wheel.",
    "In a society that makes us aggressively pursue more.",
    "More success, more excitement, more validation.",
    "We should aim for less",
    "and reconnect with the present moment.",
    "It is time to remember the art of being human.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const totalDuration = 100000; // 1:40 minutes = 100 seconds
    const intervalDuration = totalDuration / subtitles.length;

    const interval = setInterval(() => {
      // Fade out current subtitle
      setVisible(false);

      // After fade, show next subtitle
      setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev < subtitles.length - 1) return prev + 1;
          clearInterval(interval); // stop at the last subtitle
          return prev;
        });
        setVisible(true);
      }, 500); // match CSS transition duration
    }, intervalDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <SubtitleContainer style={{ opacity: visible ? 1 : 0 }}>
      {subtitles[currentIndex]}
    </SubtitleContainer>
  );
}
