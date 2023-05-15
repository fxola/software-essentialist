import { fizzbuzz } from "./fizzbuzz";

describe("fizzbuzz", () => {
  it("returns a string when provided with a valid number", () => {
    expect(typeof fizzbuzz(60)).toBe("string");
  });

  it("returns an empty string when provided with an invalid number", () => {
    expect(fizzbuzz(-20)).toBe("");
  });

  it("returns an empty string when provided with an invalid number", () => {
    expect(fizzbuzz(101)).toBe("");
  });
});
