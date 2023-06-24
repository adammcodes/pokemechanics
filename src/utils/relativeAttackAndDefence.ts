const relativeAttackAndDefense = (number: number) => {
  if (number === 0) {
    return "Att = Def";
  }
  if (!number) {
    return null;
  }
  if (number < 0) {
    return "Def > Att";
  }
  if (number > 0) {
    return "Att > Def";
  }
};

export default relativeAttackAndDefense;