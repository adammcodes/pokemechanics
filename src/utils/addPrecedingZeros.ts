function addPrecedingZeros(num: number, digits: number): string {
  const numString = String(num);
  const numDigits = numString.length;

  if (numDigits >= digits) {
    return numString;
  }

  const zeros = '0'.repeat(digits - numDigits);
  return zeros + numString;
};

export default addPrecedingZeros;