import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../firebase";
import * as LOCALSTORAGE from "../../constants/localstorage";

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    state = {
      // authUser: null
      authUser: JSON.parse(localStorage.getItem(LOCALSTORAGE.AUTH_USER)),
      firebaseIdToken: null
    };

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          // Get Firebase ID Token
          this.props.firebase.doGetIdToken().then(idToken => {
            this.setState({ firebaseIdToken: idToken });
          });

          // NOTE: Bool flag authUser.isAnonymous is automatically set by firebase authentication
          if (!authUser.isAnonymous) {
            // Note: Important!
            // Do not use localStorage: LOCALSTORAGE.AUTH_USER, if it's anonymous
            //  Because there is no way to check stored AuthUser is Valid.
            //  Once problem happended when Authentication was deleted on the Firestore console side.
            localStorage.setItem(
              LOCALSTORAGE.AUTH_USER,
              JSON.stringify(authUser)
            );
          }
          this.setState({ authUser });
        },
        () => {
          localStorage.removeItem(LOCALSTORAGE.AUTH_USER);
          this.setState({ authUser: null });
        }
      );
    }

    componentWillUnmount() {
      // To avoid memory leaks
      this.listener();
    }

    render() {
      // console.log(this.state.firebaseIdToken)
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
