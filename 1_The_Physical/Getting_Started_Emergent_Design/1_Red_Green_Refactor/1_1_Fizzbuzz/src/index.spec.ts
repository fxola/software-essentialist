import { fizzbuzz } from "./fizzbuzz";

describe("fizzbuzz", () => {
  it("returns a string when provided with a valid number", () => {
    expect(typeof fizzbuzz(60)).toBe("string");
  });
});
