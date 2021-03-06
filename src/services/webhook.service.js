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
      const { replyToken } = event;
      if (event.type === 'message') {
        const { message } = event;
        const { text } = message;
        const answer = await this.firebaseService.findKeyword(text);
        if (answer) {
          this.answerKeyword(replyToken, text, answer);
        } else {
          this.sendQuestion(replyToken, text);
        }
      }

      if (event.type === 'postback') {
        console.log('this is postback');
        console.log(event);
        const keyword = event.postback.data;
        this.confirmAddAnswer(replyToken, keyword)
      }
    });
  }

  confirmAddAnswer(replyToken, keyword) {
    const message = {
      type: 'text',
      text: `พิมพ์ความหมายคำว่า '${keyword}'`,
    }

    this.lineClient.replyMessage(replyToken, message)
  }

  sendQuestion(replyToken, keyword) {
    const messages = [
      {
        type: 'text',
        text: `ไม่เจอคำว่า '${keyword}' ในระบบ`,
      },
      {
        type: "flex",
        altText: 'confirmation',
        contents: {
          type: 'bubble',
          size: 'micro',
          action: {
            type: 'postback',
            data: keyword,
          },
          body: {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'filler',
              },
              {
                type: 'text',
                text: '+ เพิ่มความหมาย',
                color: '#ffffff',
                flex: 0,
              },
              {
                type: 'filler',
              },
            ],
            spacing: 'sm',
            backgroundColor: '#17C950',
            margin: 'none',
            paddingStart: 'none',
            paddingEnd: 'none',
          },
        }
      },
    ]
    this.lineClient.replyMessage(replyToken, messages).then(() => {
      console.log(`reply question`)
    }).catch(err => {
      const response = err.originalError.response;
      console.log('reply fail', response.data);
    });
  }

  answerKeyword(replyToken, keyword, answer) {
    const message = {
      type: 'text',
      text: `${keyword}: ${answer}`,
    }
    this.lineClient.replyMessage(replyToken, message).then(() => {
      console.log(`reply success keyword is '${keyword}' = '${answer}'`)
    }).catch(err => {
      console.log('reply fail', err);
    });
  }
}
