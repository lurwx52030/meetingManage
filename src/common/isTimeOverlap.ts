export default (startA: Date, endA: Date, startB: Date, endB: Date) => {
  if (startA < endB && startB < endA) {
    return true;
  }

  return false;
};
