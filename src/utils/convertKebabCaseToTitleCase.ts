const ALL_CAPS = ["za", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"];

function convertKebabCaseToTitleCase(kebabCaseName: string) {
  if (typeof kebabCaseName !== "string") {
    throw new Error(`Invalid Input. convertKebabCaseToTitleCase expects a string type.\n 
    But it got ${kebabCaseName} with type ${typeof kebabCaseName}.\n
    Please provide a string value instead.`);
  }

  if (!kebabCaseName) return "";
  const words = kebabCaseName.split("-");
  const capitalizedWords = words.map((word) => {
    if (ALL_CAPS.includes(word)) return word.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  const titleCaseName = capitalizedWords.join(" ");
  return titleCaseName;
}

export default convertKebabCaseToTitleCase;
