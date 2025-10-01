function convertHeightToCmOrM(heightInDecimeters: number): string {
  const centimeters = heightInDecimeters * 10;
  const meters = heightInDecimeters / 10;

  // Use meters if >= 1 meter, otherwise use centimeters
  if (meters >= 1) {
    const metersString = meters.toFixed(1).replace(/\.?0+$/, "");
    return `${metersString}m`;
  } else {
    const centimetersString = centimeters.toFixed(1).replace(/\.?0+$/, "");
    return `${centimetersString}cm`;
  }
}

export default convertHeightToCmOrM;
