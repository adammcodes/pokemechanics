function convertWeightToGramsOrKg(weightInHectograms: number): string {
  if (weightInHectograms < 1000) {
    const grams = weightInHectograms * 100;
    const gramsString = grams.toFixed(2).replace(/\.?0+$/, '');
    const kilogramsString = (weightInHectograms / 10).toFixed(1).replace(/\.?0+$/, '');

    return gramsString.length <= kilogramsString.length ? `${gramsString}g` : `${kilogramsString}kg`;
  } else {
    const kilograms = weightInHectograms / 10;
    const kilogramsString = kilograms.toFixed(1).replace(/\.?0+$/, '');
    const gramsString = (weightInHectograms * 100).toFixed(2).replace(/\.?0+$/, '');

    return kilogramsString.length <= gramsString.length ? `${kilogramsString}kg` : `${gramsString}g`;
  }
};

export default convertWeightToGramsOrKg;