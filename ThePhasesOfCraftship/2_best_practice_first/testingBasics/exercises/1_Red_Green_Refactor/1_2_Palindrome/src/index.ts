export const checkPalindrome = (str: string) => {
  const reverseString = (input: string) => {
    return input.split("").reverse().join("");
  };

  return str === reverseString(str);
};
