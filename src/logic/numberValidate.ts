export const numberValidate = (inputArr: number[]) => {
  const answerSource = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const isLengthValid = inputArr.length === 3;
  //answerSourceに含まれるか
  const isAllAnswerSourceOption = inputArr.every((val) =>
    answerSource.includes(val)
  );
  //重複チェック
  const isAllDifferentValues = inputArr.every(
    (val, i) => inputArr.indexOf(val) === i
  );
  return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues;
};
