export const checkPalindrome = (str: string) => {
  const reverseString = (input: string) => {
    return input.split("").reverse().join("");
  };

  const normalizeCasing = (input: string) => {
    return input.toLowerCase();
  };

  return normalizeCasing(str) === normalizeCasing(reverseString(str));
};
