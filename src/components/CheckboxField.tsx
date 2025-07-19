import { FC } from 'react';

type Props = {
  checkedValues: number[];
  setCheckedValues: (state: number[]) => void;
};

export const CheckboxField: FC<Props> = ({
  checkedValues,
  setCheckedValues,
}) => {
  const checkValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (checkedValues.includes(Number(e.target.value))) {
      alert('同じ数字は選べないよ!');
    } else if (checkedValues.length + 1 <= 3) {
      setCheckedValues([...checkedValues, Number(e.target.value)]);
    } else if (checkedValues.length === 3) {
      alert('数字は3つ選んでね!');
    }
  };

  return (
    <>
      <div className="select-wrapper">
        {new Array(10).fill(0).map((_, i) => {
          return (
            <span key={i}>
              <input
                type="checkbox"
                value={i}
                checked={checkedValues.includes(i)}
                onChange={(e) => checkValues(e)}
              />
              <label>{i}</label>
            </span>
          );
        })}
      </div>
      <span className="selected-number">選んだ数字→{checkedValues}</span>
    </>
  );
};
