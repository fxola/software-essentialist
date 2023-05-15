export const fizzbuzz = (value: number): string => {
  if (isNaN(value) || value < 1 || value > 100) return "";

  if (value % 3 === 0) return "Fizz";

  return value.toString();
};
