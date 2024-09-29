import { useState, useEffect } from "react";
import styled from "styled-components";

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fec9d1;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 50px;
  width: 80vw;
  justify-content: center;

  @media (max-width: 1100px) {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
  }
`;

const Square = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
  flex-shrink: 0;

  @media (max-width: 750px) {
    width: 80px; // Width when screen is smaller than 700px
    height: 80px; // Height when screen is smaller than 700px
  }
`;

const Background = styled.div`
  background-color: ${(props) =>
    props.isMatched ? "#fec9d1" : props.isClicked ? "transparent" : "red"};
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

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
    <Container>
      <Grid>
        {imageArray.map((image, index) => (
          <Square key={index} onClick={() => handleSquareClick(index)}>
            <Background isMatched={matched[index]} isClicked={clicked[index]} />
            {clicked[index] && !matched[index] && (
              <Image src={image} alt={`Image ${index + 1}`} />
            )}
          </Square>
        ))}
      </Grid>
    </Container>
  );
}
