export class HitAndBlow {
  private readonly answerSource = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ];
  private player1answer: string[];
  private player2answer: string[];
  private tryCount = 0;
  private mode = 'nomal';

  constructor(player1answer: string[], player2answer: string[]) {
    this.player1answer = player1answer;
    this.player2answer = player2answer;
  }

  //３つの数字を決定
  // async setting() {
  //   while (this.answer.length < answrLength) {
  //     const num = Math.floor(Math.random() * this.answerSource.length);
  //     const selectedItem = this.answerSource[num];
  //     if (!this.answer.includes(selectedItem)) {
  //       this.answer.push(selectedItem);
  //     }
  //   }
  // }

  async play(input: string[]) {
    if (!this.validate(input)) {
      alert('無効な入力です!');
      //this.init();
      return;
    }
    const result = this.check(input);
    //this.init();
    if (result.hit === 3) {
      this.end();
      return;
    }
    if (result.hit === 3) this.tryCount += 1;
    else {
      //ログ入力
      const log = document.getElementById('log');
      const ele = document.createElement('ul');
      ele.innerHTML = `${input}: Hit: ${result.hit} Blow: ${result.blow}`;
      log?.appendChild(ele);

      this.tryCount += 1;
    }
  }

  private check(input: string[]) {
    let hitCount = 0;
    let blowCount = 0;

    // input.forEach((val, index) => {
    //   if (val === this.answer[index]) hitCount += 1;
    //   else if (this.answer.includes(val)) blowCount += 1;
    // });
    return {
      hit: hitCount,
      blow: blowCount,
    };
  }

  private validate(inputArr: string[]) {
    const isLengthValid = inputArr.length === 3;
    //answerSourceに含まれるか
    const isAllAnswerSourceOption = inputArr.every((val) =>
      this.answerSource.includes(val)
    );
    //重複チェック
    const isAllDifferentValues = inputArr.every(
      (val, i) => inputArr.indexOf(val) === i
    );
    return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues;
  }

  // init() {
  //   const checkbox = document.querySelectorAll(
  //     "input[type='checkbox']"
  //   ) as NodeListOf<HTMLInputElement>;
  //   for (let i = 0; i < checkbox.length; i++) {
  //     checkbox[i].checked = false;
  //   }
  //   document.getElementById('select')!.innerHTML = '';
  // }

  end() {
    alert(`正解です!! \n試行回数: ${this.tryCount}回`);
    this.reset();
  }

  reset() {
    // const log = document.getElementById('log')!;
    // log.innerHTML = '';

    this.player1answer = [];
    this.player2answer = [];
    this.tryCount = 0;
    //this.setting();
  }
}
