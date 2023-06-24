function convertKebabCaseToTitleCase(kebabCaseName: string) {
  if (typeof kebabCaseName !== "string") throw new Error("Invalid Input. convertKebabCaseToTitleCase expects a string.")

  if (!kebabCaseName) return "";
  const words = kebabCaseName.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  const titleCaseName = capitalizedWords.join(" ");
  return titleCaseName;
}

export default convertKebabCaseToTitleCase;