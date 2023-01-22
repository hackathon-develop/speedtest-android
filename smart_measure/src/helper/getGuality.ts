export const getQuality = (
  value: number,
  min: number,
  diff: number,
): number => {
  const step = diff / 3;
  if (value < min + step) {
    return 3;
  }
  if (value > min + step && value < min + 2 * step) {
    return 2;
  }
  return 1;
};
