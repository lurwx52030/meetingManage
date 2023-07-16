import { Injectable } from '@nestjs/common';
import {
  Client,
  ClientConfig,
  FollowEvent,
  MessageEvent,
  WebhookEvent,
} from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';
import { q, Question, ConversationEntity } from '../common/conversation.entity';
import {
  EVENT_TYPE_METADATA,
  linebotEventHandler,
} from 'src/common/linebotEventHandler';

class employeeConversation extends ConversationEntity {
  lineid: string;

  @Question(2, '員工編號')
  employeeId = '';

  @Question(1, '姓名')
  name = '';

  constructor(lineid: string) {
    super();
    this.lineid = lineid;
  }
}

@Injectable()
export class LinebotService {
  constructor(private readonly configService: ConfigService) {}

  client = new Client(this.configService.get('linebot'));

  tempEmployees: employeeConversation[] = [];
  employeeStatus = false;

  private async handle(event: WebhookEvent) {
    const methods = Object.getOwnPropertyNames(
      this.constructor.prototype,
    ).filter(
      (prop) => prop != 'constructor' && typeof this[prop] === 'function',
    );

    for (const method of methods) {
      const handleFunction = this[method];
      const handleEvent = Reflect.getMetadata(
        EVENT_TYPE_METADATA,
        handleFunction,
      );
      if (
        handleEvent !== null &&
        handleEvent !== undefined &&
        handleEvent === event.type
      ) {
        await handleFunction.apply(this, arguments);
        break;
      }
    }
  }

  @linebotEventHandler('message')
  messageEventHandler(event: MessageEvent) {
    // console.log('eventHandler！');
    // console.log(event.type);

    const { replyToken, message } = event;

    const temp =
      this.tempEmployees.length === 0
        ? undefined
        : this.tempEmployees.filter(
            (employee) => employee.lineid === event.source.userId,
          )[0];

    switch (message.type) {
      case 'text':
        if (temp !== undefined && temp !== null && temp.state) {
          temp.responseHandler = (msg: string) => {
            this.client.replyMessage(replyToken, {
              type: 'text',
              text: msg,
            });
          };

          temp.resultHandler = (questions: Array<q>) => {
            let res = questions.reduce((past, curr) => {
              return Object.assign(past, { [curr.name]: curr.value });
            }, {});
            res = { ...res, lineid: temp.lineid };

            let response = '';
            response += Object.keys(res).reduce(
              (past, curr) => past + `${curr}: ${res[curr]}\n`,
              '',
            );

            temp.responseHandler(response);
          };

          temp.conversation(message.text);
        } else {
          const res = `$${message.text.split('').reverse().join('')}$`;
          this.client.replyMessage(replyToken, {
            type: 'text',
            text: res,
            emojis: [
              {
                index: 0,
                productId: '5ac21a13031a6752fb806d57',
                emojiId: '082',
              },
              {
                index: res.length - 1,
                productId: '5ac21a13031a6752fb806d57',
                emojiId: '083',
              },
            ],
          });
        }
        break;
      default:
        break;
    }
  }

  @linebotEventHandler('follow')
  followEventHandler(event: FollowEvent) {
    const res = `歡迎使用$會議一點通$`;

    const emp = new employeeConversation(event.source.userId);
    emp.responseHandler = (msg: string) => {
      this.client
        .replyMessage(event.replyToken, [
          {
            type: 'text',
            text: res,
            emojis: [
              {
                index: res.indexOf('會') - 1,
                productId: '5ac21a13031a6752fb806d57',
                emojiId: '082',
              },
              {
                index: res.length - 1,
                productId: '5ac21a13031a6752fb806d57',
                emojiId: '083',
              },
            ],
          },
          {
            type: 'text',
            text: '請依以下步驟填寫資料',
          },
          {
            type: 'text',
            text: msg,
          },
        ])
        .then(() => console.log('success！'))
        .catch((err) => console.error(err));
    };
    emp.start();

    if (this.tempEmployees.length === 0) {
      this.tempEmployees.push(emp);
    } else {
      if (
        this.tempEmployees.filter(
          (employee) => employee.lineid !== event.source.userId,
        ).length > 0
      ) {
        this.tempEmployees.push(emp);
      }
    }
  }

  responseUser(messages: { destination: string; events: WebhookEvent[] }) {
    messages.events.map(async (event) => {
      await this.handle(event);
    });
  }
}
