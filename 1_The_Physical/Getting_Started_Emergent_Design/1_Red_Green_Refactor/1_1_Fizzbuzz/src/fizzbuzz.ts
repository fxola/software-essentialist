export const fizzbuzz = (value: number): string => {
  if (isNaN(value) || value < 1 || value > 100) return "";
  return value.toString();
};
