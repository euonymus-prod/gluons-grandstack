import app from "firebase/app";
import FirebaseCore from "firebase-context";

class Firebase extends FirebaseCore {
  // *** Merge Auth and DB User API *** //

  mergeUser = async authUser => {
    if (!authUser) {
      return false;
    }
    return await this.user(authUser.uid)
      .get()
      .then(doc => {
        const user = doc.data();

        // NOTE: Bool flag authUser.isAnonymous is automatically set by firebase authentication
        // merge auth and db user
        authUser = {
          uid: authUser.uid,
          email: authUser.email,
          emailVerified: authUser.emailVerified,
          providerData: authUser.providerData,
          isAnonymous: authUser.isAnonymous,
          ...user
        };

        return authUser;
      });
  };

  onAuthUserListener = (next, fallback) => {
    return this.onAuthStateChanged(this.mergeUser, next, fallback);
  };

  // *** User API ***
  users = () => this.db.collection("users");
  user = uid => this.users().doc(uid);

  // Tools
  // date must be Date type
  generateTimestampType = date => app.firestore.Timestamp.fromDate(date);
}

export default Firebase;
