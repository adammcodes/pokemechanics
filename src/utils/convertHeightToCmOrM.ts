function convertHeightToCmOrM(heightInDecimeters: number): string {
  const centimeters = heightInDecimeters * 10;
  const centimetersString = centimeters.toFixed(1).replace(/\.?0+$/, '');
  const metersString = (heightInDecimeters / 10).toFixed(1).replace(/\.?0+$/, '');

  return centimetersString.length <= metersString.length ? `${centimetersString}cm` : `${metersString}m`;
};

export default convertHeightToCmOrM;