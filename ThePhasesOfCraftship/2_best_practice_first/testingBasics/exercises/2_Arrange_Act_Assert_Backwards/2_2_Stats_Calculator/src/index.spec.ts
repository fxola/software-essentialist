//Description: Your task is to process a sequence of integer numbers to determine the following statistics:
// Without using system Math library functions, process a sequence of integers
// to determine the following statistics:
//minimum value = -8,
//  maximum value = 53,
// number of elements in the sequence = 6,
// average value = 18.666666666667

import { StatsCalculator } from ".";

//doings -
// compute minimum value
// compute max value
// compute number of elements
// compute average value

describe("stats calculator", () => {
  const input = [1, 2, 3, 4];
  it("knows that 1 is the minimum value in [1,2,3,4]", () => {
    const result = StatsCalculator.compute(input);
    expect(result.minimum).toBe(1);
  });
  it("knows that 4 is the maximum value in [1,2,3,4]", () => {
    const result = StatsCalculator.compute(input);
    expect(result.maximum).toBe(4);
  });

  it.todo("knows that 4 is the number of elements in [1,2,3,4]");

  it.todo("knows that 2.5 is the average value in [1,2,3,4]");
});
