// convert roman numeral to number
export const convertNumeralToNumber = (numeral: string): number => {
  // numerals are expressed as strings such as "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"
  const numeralToNumber: { [key: string]: number } = {
    i: 1,
    v: 5,
    x: 10,
  };

  const numeralArray = numeral.split("");
  let result = 0;

  for (let i = 0; i < numeralArray.length; i++) {
    const currentNumeral = numeralArray[i];
    const nextNumeral = numeralArray[i + 1];

    if (numeralToNumber[currentNumeral] < numeralToNumber[nextNumeral]) {
      result -= numeralToNumber[currentNumeral];
    } else {
      result += numeralToNumber[currentNumeral];
    }
  }

  return result;
};
