/**
 * Ukrainian noun agreement after a numeral. Three forms, not two:
 * 1 матеріал / 2 матеріали / 5 матеріалів — and the teens all take the last
 * form regardless of their final digit (11, 12, 14 → матеріалів).
 */
export const plural = (n: number, one: string, few: string, many: string) => {
  const lastDigit = n % 10;
  const lastTwo = n % 100;

  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (lastDigit === 1) return one;
  if (lastDigit >= 2 && lastDigit <= 4) return few;
  return many;
};
