import { fizzbuzz } from "./fizzbuzz";

describe("fizzbuzz", () => {
  const mulitplesOfThree = [3, 9, 42];
  it("returns a string when provided with a valid number", () => {
    expect(typeof fizzbuzz(60)).toBe("string");
  });

  it("returns an empty string when provided with an invalid number", () => {
    expect(fizzbuzz(-20)).toBe("");
  });

  it("returns an empty string when provided with an invalid number", () => {
    expect(fizzbuzz(101)).toBe("");
  });

  it("returns an empty string when provided with a non number", () => {
    expect(fizzbuzz(Number("smooth"))).toBe("");
  });

  it.each(mulitplesOfThree)(
    `returns "Fizz" when provided with multiples of 3`,
    (value) => {
      expect(fizzbuzz(value)).toBe("Fizz");
    }
  );

  it(`returns "Buzz" when provided with multiples of 5`, () => {
    expect(fizzbuzz(20)).toBe("Buzz");
  });

  it(`returns "FizzBuzz" when provided with a multiples of 3 and 5`, () => {
    expect(fizzbuzz(45)).toBe("FizzBuzz");
  });
});
