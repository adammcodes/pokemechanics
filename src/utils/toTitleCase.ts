function toTitleCase(str: string) {
  // Split the string on spaces and dashes, but keep the delimiter
  const parts = str.split(/(\s+|\-)/);

  // Capitalize the first letter of each part and keep dashes as they are
  const capitalizedParts = parts.map((part) =>
    /[\s-]/.test(part)
      ? part
      : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  // Join the parts back together
  return capitalizedParts.join("");
}

export default toTitleCase;
