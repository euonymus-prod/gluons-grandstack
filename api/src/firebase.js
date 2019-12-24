import * as admin from 'firebase-admin';
const serviceAccount = require("../SAKey4dev.json");

// NOTE: This class is using Singleton Pattern
class Firebase {
  constructor() {
    this._data = {
      isVelified: null
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }

  async verifyIdToken(idToken) {
    if (this._data['isVelified'] === null) {
      const decoded = await admin.auth().verifyIdToken(idToken).catch( error => {
        // Handle error
        this._data['isVelified'] = false
      })
      this._data['isVelified'] = true
    }
    return this._data['isVelified']
  }
}

const firebaseInstance = new Firebase();

// 既存のプロパティ属性と値の変更、および新しいプロパティの追加を防止
Object.freeze(firebaseInstance);

export default firebaseInstance;
