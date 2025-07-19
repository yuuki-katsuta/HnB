export const nameValidate = (name: string): boolean => {
  const isLengthValid = name.length <= 10 && name.length > 0;
  const isNotEmpty = name.trim() !== '';
  return isLengthValid && isNotEmpty;
};
