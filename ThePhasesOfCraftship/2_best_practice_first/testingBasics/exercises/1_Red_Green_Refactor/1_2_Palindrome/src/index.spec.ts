// Description: Create a palindrome checker that should be able to detect
// that a string is a palindrome; that is, it is the same word or phrase in reverse.
// This means that words like "mom" and "wow" palindromes.
// It also means that words like "bill" are not palindromes.
// It should still know that something is a palindrome,
// even if the casing is off (that means that "Mom" is still a palindrome).
// Lastly, it should also be able to detect palindromes
// in phrases like "Was It A Rat I Saw" and "Never Odd or Even" too.

import { checkPalindrome } from ".";

describe("palindrome checker", () => {
  it.each(["mom", "wow", "tut"])("knows that %s is a palindrome", (value) => {
    expect(checkPalindrome(value)).toBeTruthy();
  });

  it.each(["bill", "competition", "camouflage"])(
    "knows that %s is not a palindrome",
    (value) => {
      expect(checkPalindrome(value)).toBeFalsy();
    }
  );

  it.each(["Mom", "boB", "wOw"])(
    "knows that %s is still a palindrome when the casing is not uniform",
    (value) => {
      expect(checkPalindrome(value)).toBeTruthy();
    }
  );

  it.each(["Was It A Rat I Saw", "Never Odd or Even"])(
    "knows that %s is a palindrome when there is spacing between the words",
    (value) => {
      expect(checkPalindrome(value)).toBeTruthy();
    }
  );
});
