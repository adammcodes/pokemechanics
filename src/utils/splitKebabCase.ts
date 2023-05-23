function splitKebabCase(input: string): string[] | string {

  if (!input.includes("-")) return input;

  const words = input.split("-");
  const middleIndex = Math.floor(words.length / 2);
  const first = words.slice(0, middleIndex).join("-");
  const second = words.slice(middleIndex).join("-");

  return [first, second];
};

export default splitKebabCase;