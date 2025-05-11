export const checkPalindrome = (str: string) => {
  return str === str.split("").reverse().join("");
};
