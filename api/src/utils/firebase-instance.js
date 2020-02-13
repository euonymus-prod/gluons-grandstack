import * as admin from 'firebase-admin';
import dotenv from "dotenv";
// const serviceAccount = require("../../SAKey4dev.json");
// const serviceAccount = require("../../SAKey4prod.json");

// const convertTableForTemporallyUse = {'qV183nzQ79MPRBidNFTCbUxCv1H2': 2}

// NOTE: This class is using Singleton Pattern
class Firebase {
  constructor() {
    this._data = {
      isVelified: null,
      decoded: null
    };

    // set environment variables from ../.env
    const atob = require('atob');
    dotenv.config();
    const serviceAccount = atob(process.env.FIREBASE_PRIVATE_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
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

  // temporalUserId(uuid) {
  //   return convertTableForTemporallyUse[uuid]
  // }
}

const firebaseInstance = new Firebase();

// 既存のプロパティ属性と値の変更、および新しいプロパティの追加を防止
Object.freeze(firebaseInstance);

export default firebaseInstance;
