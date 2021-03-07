import * as line from '@line/bot-sdk';
import FirebaseService from './firebase.service';
import config from '../config';

export default class WebhookService {
  constructor() {
    this.firebaseService = new FirebaseService();
    this.lineClient = new line.Client({
      channelAccessToken: config.line.channelAccessToken,
    });
  }

  async hookAction(body) {
    const events = body.events;
    events.map(async (event) => {
      const { replyToken, source } = event;
      const { userId } = source;
      if (event.type === 'message') {
        const { message } = event;
        const { text } = message;
        const waitList = await this.firebaseService.findWaitlist(userId);
        if (waitList) {
          console.log(text, 'is answer keyword', waitList.keyword);
          await this.confirmSaveAnswer(replyToken, waitList.keyword, text);
        } else {
          const answer = await this.firebaseService.findKeyword(text);
          if (answer) {
            this.answerKeyword(replyToken, text, answer);
          } else {
            this.sendQuestion(replyToken, text);
          }
        }
      }

      if (event.type === 'postback') {
        const { type, keyword, answer } = JSON.parse(event.postback.data);
        console.log(type, keyword, answer);
        if (type === 'add') {
          await this.confirmAddAnswer(replyToken, keyword, userId);
        } else if (type === 'save') {
          await this.saveKeywordAnswer(replyToken, keyword, answer, userId);
          await this.firebaseService.removeList(userId);
        } else if (type === 'unsave') {
          await this.cancelKeyword(replyToken, keyword);
          await this.firebaseService.removeList(userId);
        } else if (type === 'remove') {
          this.removeKeyword(replyToken, keyword, answer, userId);
        }
      }
    });
  }

  async removeKeyword(replyToken, keyword, userId) {
    const message = {
      type: 'text',
      text: `ลบความหมายของคำว่า ${keyword} เรียบร้อยแล้ว`
    };
    await this.firebaseService.removeKeywordDictionary(keyword, userId);
    await this.sendMesssage(replyToken, message, 'remove keyword')
  }

  async saveKeywordAnswer(replyToken, keyword, answer, userId) {
    const message = [
      {
        type: 'text',
        text: 'บันทึกความหมายเรียบร้อยแล้ว'
      },
      {
        type: 'text',
        text: `${keyword}: ${answer}`
      }
    ];
    await this.firebaseService.saveDictionary(userId, keyword, answer);
    await this.sendMesssage(replyToken, message, 'save keyword answer')
  }

  async cancelKeyword(replyToken, keyword) {
    const message = {
      type: 'text',
      text: `ยกเลิกการบันทึกคำ '${keyword}'`
    }
    await this.sendMesssage(replyToken, message, 'cancel keyword')
  }

  async confirmSaveAnswer(replyToken, keyword, answer) {
    const message = {
      type: 'text',
      text: `ต้องการให้ ${keyword} มีความหมายว่า ${answer} ใช่หรือไม่?`,
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'ใช่',
              data: JSON.stringify({ type: 'save', keyword, answer })
            }
          },
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'ไม่ใช่',
              data: JSON.stringify({ type: 'unsave', keyword, answer })
            }
          }
        ],
      }
    }
    await this.sendMesssage(replyToken, message, 'confirm save answer')
  }

  async confirmAddAnswer(replyToken, keyword, userId) {
    const message = {
      type: 'text',
      text: `พิมพ์ความหมายคำว่า '${keyword}'`,
    };
    await this.firebaseService.waitForAnswer(keyword, userId);
    await this.sendMesssage(replyToken, message, 'comfirm add answer')
  }

  sendQuestion(replyToken, keyword) {
    const message = {
      type: 'text',
      text: `ไม่เจอคำว่า '${keyword}' ในระบบ`,
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'postback',
              label: '+เพิ่มความหมาย',
              data: JSON.stringify({ type: 'add', keyword }),
            }
          }
        ]
      }
    };    
    await this.sendMesssage(replyToken, message, 'send question');
  }

  answerKeyword(replyToken, keyword, answer) {
    const message = {
      type: 'text',
      text: `${keyword}: ${answer}`,
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'แก้ไข',
              data: JSON.stringify({ type: 'add', keyword })
            }
          },
          {
            type: 'action',
            action: {
              type: 'postback',
              label: 'ลบคำนี้ทิ้ง',
              data: JSON.stringify({ type: 'remove', keyword })
            }
          }
        ],
      }
    }
    await this.sendMesssage(replyToken, message, 'answer keyword')
  }

  async sendMesssage(replyToken, message, action) {
    this.lineClient.replyMessage(replyToken, message).then(() => {
      console.log(`reply ${action} success`);
    }).catch(err => {
      const response = err.originalError.response;
      console.log('reply fail', response.data);
    });
  }
}
