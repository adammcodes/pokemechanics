function convertWeightToGramsOrKg(weightInHectograms: number): string {
  if (weightInHectograms < 1000) {
    const grams = weightInHectograms * 100;
    const gramsString = grams.toFixed(2).replace(/\.?0+$/, "");
    const kilogramsString = (weightInHectograms / 10)
      .toFixed(1)
      .replace(/\.?0+$/, "");

    return gramsString.length <= kilogramsString.length
      ? `${gramsString}g`
      : `${kilogramsString}kg`;
  } else {
    // For weights >= 1000 hectograms, kilograms representation is always shorter
    // Example: 1000 hg = "100kg" (5 chars) vs "100000g" (8 chars)
    const kilograms = weightInHectograms / 10;
    const kilogramsString = kilograms.toFixed(1).replace(/\.?0+$/, "");
    return `${kilogramsString}kg`;
  }
}

export default convertWeightToGramsOrKg;
