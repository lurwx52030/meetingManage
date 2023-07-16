import { Injectable } from '@nestjs/common';
import {
  Client,
  ClientConfig,
  MessageEvent,
  WebhookEvent,
} from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';

class employee {
  lineid: string;
  employeeId: string;
  name: string;
  state: number;

  constructor(lineid: string) {
    this.lineid = lineid;
    this.employeeId = '';
    this.name = '';
    this.state = 0;
  }
}

@Injectable()
export class LinebotService {
  constructor(private readonly configService: ConfigService) {}

  client = new Client(this.configService.get('linebot'));

  tempEmployees: employee[] = [];
  employeeStatus = false;

  responseUser(messages: { destination: string; events: WebhookEvent[] }) {
    messages.events.map((event) => {
      switch (event.type) {
        case 'message':
          const { replyToken, message } = event;

          const temp =
            this.tempEmployees.length === 0
              ? undefined
              : this.tempEmployees.filter(
                  (employee) => employee.lineid === event.source.userId,
                )[0];
          if (message.type === 'text') {
            if (this.employeeStatus) {
              if (temp !== undefined && temp.state === 0) {
                temp.name = message.text;
                temp.state++;

                this.client.replyMessage(replyToken, {
                  type: 'text',
                  text: '員工編號',
                });
              } else if (temp !== undefined && temp.state === 1) {
                temp.employeeId = message.text;

                (() => {
                  this.tempEmployees = this.tempEmployees.map((employee) => {
                    if (employee.lineid === temp.lineid) {
                      return { ...temp, state: 0 };
                    }
                    return { ...employee, state: 0 };
                  });

                  let res = '所輸入資料為\n';
                  res += this.tempEmployees
                    .map(
                      (employee) =>
                        `員工編號=>${employee.employeeId}\nlineUserid=>${employee.lineid}\n姓名=>${employee.name}`,
                    )
                    .join('\n');

                  this.client
                    .replyMessage(replyToken, {
                      type: 'text',
                      text: res,
                    })
                    .catch((error) => console.log(error));

                  this.employeeStatus = false;
                })();
              }
            } else {
              const res = `$${message.text.split('').reverse().join('')}$`;
              this.client
                .replyMessage(replyToken, {
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
                })
                .catch((error) => console.log(error));
              return;
            }
            this.employeeStatus = false;
          }
          break;
        case 'follow':
          const res = `歡迎使用$會議一點通$`;
          this.client
            .replyMessage(event.replyToken, {
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
            })
            .then(() => {
              this.client
                .replyMessage(event.replyToken, {
                  type: 'text',
                  text: `請依以下步驟填寫資料`,
                })
                .then(() => {
                  this.client
                    .replyMessage(event.replyToken, {
                      type: 'text',
                      text: `姓名`,
                    })
                    .catch((err) => console.error(err));
                })
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));

          if (this.tempEmployees.length === 0) {
            this.tempEmployees.push(new employee(event.source.userId));
          } else {
            if (
              this.tempEmployees.filter(
                (employee) => employee.lineid !== event.source.userId,
              ).length > 0
            ) {
              this.tempEmployees.push(new employee(event.source.userId));
            }
          }
          this.employeeStatus = true;
          break;
        default:
          break;
      }
    });
  }
}
