export const padNumber = (num: number, targetLength: number): string => {
  const str = num.toString();
  const currentLength = str.length;

  if (currentLength >= targetLength) {
    return str;
  }

  const padding = '0'.repeat(targetLength - currentLength);
  return padding + str;
};
