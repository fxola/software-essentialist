export const checkPalindrome = (str: string) => {
  const reverseString = (input: string) => {
    return input.split("").reverse().join("");
  };

  const normalizeCasing = (input: string) => {
    return input.toLowerCase();
  };

  const removeWhiteSpace = (input: string) => {
    let whiteSpaceRegex = /\s/g;
    const result = input.replace(whiteSpaceRegex, "");
    return result;
  };

  return (
    removeWhiteSpace(normalizeCasing(str)) ===
    removeWhiteSpace(normalizeCasing(reverseString(str)))
  );
};
