import { useState, useEffect } from "react";

const imageArray = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "1.jpg", // Match for 1.jpg
  "2.jpg", // Match for 2.jpg
  "3.jpg", // Match for 3.jpg
  "4.jpg", // Match for 4.jpg
  "5.jpg", // Match for 5.jpg
  "6.jpg", // Match for 6.jpg
  "7.jpg", // Match for 7.jpg
  "8.jpg", // Match for 8.jpg
  "9.jpg", // Match for 9.jpg
];

export default function Memory() {
  const [clicked, setClicked] = useState(Array(18).fill(false));
  const [matched, setMatched] = useState(Array(18).fill(false));
  const [selectedIndices, setSelectedIndices] = useState([]);

  const handleSquareClick = (index) => {
    if (clicked[index] || matched[index] || selectedIndices.length >= 2) return;

    const newClicked = [...clicked];
    newClicked[index] = true;
    setClicked(newClicked);
    setSelectedIndices((prev) => [...prev, index]);
  };

  useEffect(() => {
    if (selectedIndices.length === 2) {
      const [firstIndex, secondIndex] = selectedIndices;

      if (imageArray[firstIndex] === imageArray[secondIndex]) {
        // If a match is found, display images first
        setTimeout(() => {
          const newMatched = [...matched];
          newMatched[firstIndex] = true;
          newMatched[secondIndex] = true;
          setMatched(newMatched);
          setSelectedIndices([]);
        }, 1000); // Display images for 1 second
      } else {
        setTimeout(() => {
          const resetClicked = [...clicked];
          resetClicked[firstIndex] = false;
          resetClicked[secondIndex] = false;
          setClicked(resetClicked);
          setSelectedIndices([]);
        }, 1000);
      }
    }
  }, [selectedIndices]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#fec9d1",
      }}
    >
      <div
        style={{
          display: "grid", // Use grid for a fixed layout
          gridTemplateColumns: "repeat(6, 1fr)", // 6 columns
          gap: "40px", // Space between squares
          width: "80vw", // Adjust based on your tile size and number (6 columns * 120px + gap)
          maxWidth: "900px",
          justifyContent: "center", // Center the grid horizontally
        }}
      >
        {imageArray.map((image, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: "100%", // Use 100% to fill the grid cell
              aspectRatio: "1 / 1", // Maintain a square aspect ratio
              cursor: "pointer",
            }}
            onClick={() => handleSquareClick(index)}
          >
            <div
              style={{
                backgroundColor: matched[index]
                  ? "#fec9d1" // Change to "#fec9d1" if matched
                  : clicked[index]
                  ? "transparent"
                  : "red",
                width: "100%",
                height: "100%",
              }}
            />
            {clicked[index] && !matched[index] && (
              <img
                src={image}
                alt={`Image ${index + 1}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
