import { fizzbuzz } from "./fizzbuzz";

describe("fizzbuzz", () => {
  const mulitplesOfThree = [3, 9, 42];
  const mulitplesOfFive = [5, 20, 50];
  const mulitplesOfThreeAndFive = [15, 45, 90];
  const numbersOutOfBound = [-20, -12, 101, 102];

  it("returns a string when provided with a valid number", () => {
    expect(typeof fizzbuzz(60)).toBe("string");
  });

  it.each(numbersOutOfBound)(
    "returns an empty string when provided with an invalid number like %s",
    (value) => {
      expect(fizzbuzz(value)).toBe("");
    }
  );

  it("returns an empty string when provided with a non number", () => {
    expect(fizzbuzz(Number("smooth"))).toBe("");
  });

  it.each(mulitplesOfThree)(
    `returns "Fizz" when provided with multiples of 3 like %s`,
    (value) => {
      expect(fizzbuzz(value)).toBe("Fizz");
    }
  );

  it.each(mulitplesOfFive)(
    `returns "Buzz" when provided with multiples of 5 like %s`,
    (value) => {
      expect(fizzbuzz(value)).toBe("Buzz");
    }
  );

  it.each(mulitplesOfThreeAndFive)(
    `returns "FizzBuzz" when provided with a multiple of 3 and 5`,
    (value) => {
      expect(fizzbuzz(value)).toBe("FizzBuzz");
    }
  );
});
