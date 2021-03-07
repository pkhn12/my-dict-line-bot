import firebase from 'firebase';
import config from '../config';

export default class FirebaseService {
  constructor() {
    const firebaseConfig = config.firebase;
    firebase.initializeApp(firebaseConfig);
    this.database = firebase.database();
    this.dictionary = this.database.ref('dictionary');
      
  }

  async findKeyword(text) {
    const data = (await this.dictionary.child(text).get()).val();
    return data? data.answer : null;
  }

  async waitForAnswer(keyword, userId) {
    console.log(`Wait for ${userId} add answer of keyword '${keyword}'`)
    this.database.ref('waitList/' + userId).set({ keyword });
  }

  async findWaitlist(userId) {
    console.log(`find wait list user: ${userId}`);
    const db = await this.database.ref('waitList/' + userId).get();
    const value = db.val();
    return value;
  }

  async removeList(userId) {
    await this.database.ref('waitList/' + userId).remove();
    console.log(`removelist ${userId}`);
  }
}