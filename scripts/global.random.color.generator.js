// Generate Random Color
const getRandomColorValue = () => Math.floor(Math.random() * 255 + 1);
const getRandomGeneratedColor = () => {
  const random1 = getRandomColorValue();
  const random2 = getRandomColorValue();
  const random3 = getRandomColorValue();

  return `rgb(${random1},${random2},${random3})`;
};
