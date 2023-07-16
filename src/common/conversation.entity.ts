export interface q {
  order: number;
  msg: string;
  name: string;
  value: string;
}

export class ConversationEntity {
  state = true;
  questionStep = 1;
  questionAndAnswers: Array<q> = [];
  responseHandler: (msg: string) => void;
  resultHandler: (questions: Array<q>) => void;

  start() {
    this.state = true;
    this.responseHandler(
      this.questionAndAnswers.filter((q) => q.order === this.questionStep)[0]
        .msg,
    );
  }

  end() {
    this.state = false;
  }

  conversation(msg: string) {
    if (this.state) {
      if (this.questionStep === this.questionAndAnswers.length) {
        this.questionAndAnswers.filter(
          (q) => q.order === this.questionStep,
        )[0].value = msg;

        this.end();

        if (this.resultHandler !== null && this.resultHandler !== undefined) {
          this.resultHandler(this.questionAndAnswers);
        }
      } else {
        this.questionAndAnswers.filter(
          (q) => q.order === this.questionStep,
        )[0].value = msg;

        this.questionStep++;

        if (
          this.responseHandler !== null &&
          this.responseHandler !== undefined
        ) {
          this.responseHandler(
            this.questionAndAnswers.filter(
              (q) => q.order === this.questionStep,
            )[0].msg,
          );
        }
      }
    } else {
      throw 'this conversation is done！';
    }
  }
}

export function Question(order: number, msg: string): PropertyDecorator {
  if (order < 1) {
    throw 'order must greater then 0！';
  }

  return (target: any, propertyName: string) => {
    let value: string;
    Object.defineProperty(target, propertyName, {
      get: function () {
        return value;
      },
      set: function (newVal: string) {
        const questionAndAnswers: Array<q> = this['questionAndAnswers'];
        if (
          questionAndAnswers.filter((item) => order == item.order).length == 0
        ) {
          questionAndAnswers.push({
            order,
            msg,
            name: propertyName,
            value: newVal,
          });
        }
      },
    });
  };
}

function test() {
  class A extends ConversationEntity {
    lineid = '';

    @Question(1, 'abc')
    a = '1';

    @Question(2, 'def')
    b = 'qwe';

    @Question(3, 'rrr')
    c = 'qwzxc';

    @Question(4, 'asdasdqwr')
    d = 'zczxczxc';

    constructor(lineid: string) {
      super();
      this.lineid = lineid;
    }
  }

  const w = new A('qweasd');
  w.responseHandler = (msg: string) => console.log(msg);
  w.resultHandler = (questions: Array<q>) => {
    const res = questions.reduce((past, curr) => {
      return Object.assign(past, { [curr.name]: curr.value });
    }, {});
    console.log(res);
  };

  console.log(`lineid: ${w.lineid}`);
  w.start();
  w.conversation('abc');
  w.conversation('tqt');
  w.conversation('twt');
  w.conversation('twtp');
}
