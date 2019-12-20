import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../firebase";
import * as LOCALSTORAGE from "../../constants/localstorage";

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    state = {
      // authUser: null
      authUser: JSON.parse(localStorage.getItem(LOCALSTORAGE.AUTH_USER))
    };

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        async authUser => {
          if (!this.idUserUpdated(authUser, this.state.authUser)) {
            return;
          }

          // Get Firebase ID Token
          const idToken = await this.props.firebase.doGetIdToken();

          const authUserModified = { ...authUser, idToken };
          // NOTE: Bool flag authUser.isAnonymous is automatically set by firebase authentication
          if (!authUserModified.isAnonymous) {
            // Note: Important!
            // Do not use localStorage: LOCALSTORAGE.AUTH_USER, if it's anonymous
            //  Because there is no way to check stored AuthUser is Valid.
            //  Once problem happended when Authentication was deleted on the Firestore console side.
            localStorage.setItem(
              LOCALSTORAGE.AUTH_USER,
              JSON.stringify(authUserModified)
            );
          }
          this.setState({ authUser: authUserModified });
        },
        () => {
          localStorage.removeItem(LOCALSTORAGE.AUTH_USER);
          if (this.state.authUser !== null) {
            this.setState({ authUser: null });
          }
        }
      );
    }

    componentWillUnmount() {
      // To avoid memory leaks
      this.listener();
    }

    idUserUpdated = (authUser, authUser2) => {
      return (
        !authUser2 ||
        authUser["uid"] !== authUser2["uid"] ||
        authUser["email"] !== authUser2["email"] ||
        authUser["emailVerified"] !== authUser2["emailVerified"] ||
        authUser["is_admin"] !== authUser2["is_admin"] ||
        authUser["is_approved"] !== authUser2["is_approved"]
      );
    };

    render() {
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
