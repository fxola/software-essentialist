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

  const sanitizedOriginalString = removeWhiteSpace(normalizeCasing(str));
  const sanitizedReversedString = removeWhiteSpace(
    normalizeCasing(reverseString(str))
  );

  return sanitizedOriginalString === sanitizedReversedString;
};
