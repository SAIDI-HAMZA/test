export const addDays = (n: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date;
};
