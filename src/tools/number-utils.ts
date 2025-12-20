export const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const sum = (array: number[]) => {
  return array.reduce((acc, curr) => acc + curr, 0);
};
