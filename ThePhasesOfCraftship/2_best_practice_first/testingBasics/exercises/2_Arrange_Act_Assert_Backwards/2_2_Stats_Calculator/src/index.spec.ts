//Description: Your task is to process a sequence of integer numbers to determine the following statistics:
// Without using system Math library functions, process a sequence of integers
// to determine the following statistics:
//minimum value = -8,
//  maximum value = 53,
// number of elements in the sequence = 6,
// average value = 18.666666666667

import { Stats, StatsCalculator } from ".";

//doings -
// compute minimum value
// compute max value
// compute number of elements
// compute average value

describe("stats calculator", () => {
  it.each([
    { value: 1, resultKey: "minimum", input: [1, 2, 3, 4] },
    { value: 4, resultKey: "maximum", input: [1, 2, 3, 4] },
    { value: 4, resultKey: "total", input: [1, 2, 3, 4] },
    { value: 2.5, resultKey: "average", input: [1, 2, 3, 4] },
  ])(
    "knows that $value is the $resultKey value in $input",
    ({ value, resultKey, input }) => {
      const result = StatsCalculator.compute(input);
      const stat = result[resultKey as keyof Stats];
      expect(stat).toBe(value);
    }
  );

  it.each([
    { value: -1, resultKey: "minimum", input: [-1, 20, 4, 5] },
    { value: 20, resultKey: "maximum", input: [-1, 20, 4, 5] },
    { value: 4, resultKey: "total", input: [-1, 20, 4, 5] },
    { value: 7, resultKey: "average", input: [-1, 20, 4, 5] },
  ])(
    "knows that $value is the $resultKey value in $input",
    ({ value, resultKey, input }) => {
      const result = StatsCalculator.compute(input);
      const stat = result[resultKey as keyof Stats];
      expect(stat).toBe(value);
    }
  );
});
