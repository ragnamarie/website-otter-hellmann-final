import { useEffect, useState } from "react";
import styled from "styled-components";

const SubtitleContainerDesktop = styled.div`
  color: #e6331b;
  font-size: 2vw;
  text-align: center;
  line-height: 1.6;
  max-width: 90%;
  margin: 0 auto;
  pointer-events: none;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 900;
  transition: opacity 0.5s ease;

  @media (max-width: 950px) {
    display: none; /* hide on mobile */
  }
`;

const SubtitleContainerMobile = styled.div`
  color: #e6331b;
  font-size: 24px; /* bigger for mobile */
  text-align: center;
  line-height: 1.5;
  width: 90%;
  pointer-events: none;

  position: fixed;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);

  z-index: 900;
  transition: opacity 0.5s ease;

  @media (min-width: 951px) {
    display: none; /* hide on desktop */
  }
`;

export default function Subtitles() {
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
    "",
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
    "In a society that makes us aggressively pursue more–",
    "more success, more excitement, more validation.",
    "We should aim for less",
    "and reconnect with the present moment.",
    "It is time to remember the art of being human.",
  ];

  const splitIndex = 10;

  const groupA = subtitles.slice(0, splitIndex);
  const groupB = subtitles.slice(splitIndex);

  const intervalA = 36500 / groupA.length;
  const intervalB = 38000 / groupB.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;

    const lastIndex = subtitles.length - 1;
    const intervalTime = currentIndex < splitIndex ? intervalA : intervalB;

    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => {
          // Not yet at the last one → go to next
          if (prev < lastIndex) {
            setVisible(true); // only fade back in if NOT the last one
            return prev + 1;
          }

          // Last subtitle: fade out, then finish
          setTimeout(() => setFinished(true), 500);
          clearInterval(interval);
          return prev;
        });
      }, 500);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [currentIndex, finished]);

  if (finished) return null;

  return (
    <>
      <SubtitleContainerDesktop style={{ opacity: visible ? 1 : 0 }}>
        {subtitles[currentIndex]}
      </SubtitleContainerDesktop>

      <SubtitleContainerMobile style={{ opacity: visible ? 1 : 0 }}>
        {subtitles[currentIndex]}
      </SubtitleContainerMobile>
    </>
  );
}
