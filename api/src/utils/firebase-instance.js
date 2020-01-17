import * as admin from 'firebase-admin';
const serviceAccount = require("../../SAKey4dev.json");

// TODO
// MEMO: firebase's user_uid is depending on firebase project
const convertTableForTemporallyUse = {'qV183nzQ79MPRBidNFTCbUxCv1H2': 2}

// NOTE: This class is using Singleton Pattern
class Firebase {
  constructor() {
    this._data = {
      isVelified: null,
      decoded: null
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    this.db = admin.firestore();
  }

  async verifyIdToken(idToken) {
    const decoded = await this.decodeIdToken(idToken)
    return !!decoded
  }

  async decodeIdToken(idToken) {
    if (!this.isInitialized()) {
      const decoded = await admin.auth().verifyIdToken(idToken).catch( error => {
        this._data['decoded'] = false
      })
      this._data['decoded'] = decoded
    }
    return this._data['decoded']
  }

  async getLoggedIn(idToken) {
    const decoded = await this.decodeIdToken(idToken)
    if (!decoded) {
      return false
    }
    const user = await this.db.collection('users').doc(decoded.uid).get()
    return { ...decoded, ...user.data() }
  }

  isInitialized() {
    return (this._data['decoded'] !== null)
  }

  temporalUserId(uuid) {
    return convertTableForTemporallyUse[uuid]
  }
}

const firebaseInstance = new Firebase();

// 既存のプロパティ属性と値の変更、および新しいプロパティの追加を防止
Object.freeze(firebaseInstance);

export default firebaseInstance;
