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
  it("knows that 'mom' is a palindrome", () => {
    expect(checkPalindrome("mom")).toBeTruthy();
  });
  it("knows that 'wow' is a palindrome", () => {
    expect(checkPalindrome("wow")).toBeTruthy();
  });
  it("knows that 'tut' is a palindrome", () => {
    expect(checkPalindrome("tut")).toBeTruthy();
  });

  it('knows that "bill" is not a palindrome', () => {
    expect(checkPalindrome("bill")).toBeFalsy();
  });
  it('knows that "competition" is not a palindrome', () => {
    expect(checkPalindrome("competition")).toBeFalsy();
  });
  it('knows that "camouflage" is not a palindrome', () => {
    expect(checkPalindrome("camouflage")).toBeFalsy();
  });
  it('knows that "Mom" is still a palindrome when the casing is not uniform', () => {
    expect(checkPalindrome("Mom")).toBeTruthy();
  });
  it.todo(
    'knows that "boB" is still a palindrome when the casing is not uniform'
  );
  it.todo(
    'knows that "wOw" is still a palindrome when the casing is not uniform'
  );

  it.todo(
    'knows that "Was It A Rat I Saw" is a palindrome when there is spacing between the words'
  );
  it.todo(
    'knows that "Never Odd or Even" is a palindrome when there is spacing between the words'
  );
});
