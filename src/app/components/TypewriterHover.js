import { useEffect, useState } from "react";

export default function TypewriterHover({ text = "Captionize", speed = 100 }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only update if not paused and not clicked
      if (!paused && !clicked) {
        setIndex((oldIndex) => {
          let newIndex = oldIndex + direction;
          if (newIndex > text.length) {
            newIndex = text.length;
            setDirection(-1);
          } else if (newIndex < 0) {
            newIndex = 0;
            setDirection(1);
          }
          return newIndex;
        });
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [paused, direction, clicked, text, speed]);

  const displayedText = text.slice(0, index);

  const handleMouseEnter = () => {
    if (!clicked) {
      setPaused(true);
      setIndex(text.length);
    }
  };

  const handleMouseLeave = () => {
    if (!clicked) {
      setPaused(false);
      setDirection(-1);
    }
  };

  const handleClick = () => {
    // On first click, permanently stop the typewriter effect
    setClicked(true);
    setPaused(true);
    setIndex(text.length);
  };

  return (
    <span 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      onClick={handleClick}
      style={{ display: "inline-block", width: "100%" }}
    >
      {displayedText}
    </span>
  );
}
