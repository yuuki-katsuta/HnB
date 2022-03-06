export const nameValidate = (name: string) => {
  const isLengthValid = name.length <= 10;
  const isEmpty = name.trim() === '';
  return isLengthValid && isEmpty;
};
