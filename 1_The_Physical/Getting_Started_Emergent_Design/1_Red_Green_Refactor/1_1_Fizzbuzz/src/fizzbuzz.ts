const isMultipleOfThree = (value: number) => value % 3 === 0;
const isMultipleOfFive = (value: number) => value % 5 === 0;

export const fizzbuzz = (value: number): string => {
  if (isNaN(value) || value < 1 || value > 100) return "";

  if (isMultipleOfThree(value)) return "Fizz";
  if (isMultipleOfFive(value)) return "Buzz";

  return value.toString();
};
