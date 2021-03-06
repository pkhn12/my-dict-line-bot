import firebase from 'firebase';
import config from '../config';

export default class FirebaseService {
  constructor() {
    const firebaseConfig = config.firebase;
    firebase.initializeApp(firebaseConfig);
    this.database = firebase.database().ref('dictionary');
  }

  async findKeyword(text) {
    const answer = (await this.database.child(text).get()).val();
    return answer;
  }
}
