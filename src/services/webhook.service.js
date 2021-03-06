import FirebaseService from './firebase.service';

export default class WebhookService  {
  constructor() {
    this.firebaseService = new FirebaseService();
  }

  async hookAction(body) {
    const events = body.events;
    events.map(async (event) => {
      if (event.type === 'message') {
        const { replyToken, message } = event;
        const { text } = message;
        const answer = await this.firebaseService.findKeyword(text);
        if (answer) {
          console.log('reply message!!!');
        } else {
          console.log('reply question');
        }
      }
    });
  };
}
