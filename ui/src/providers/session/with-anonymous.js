import React from "react";
import withAuthentication from "./with-authentication";
import { withAuthUser } from "./context";

const withAnonymous = Component => {
  class WithAnonymous extends React.Component {
    state = {
      authUser: null
    };

    componentDidMount() {
      this.fetchAnonymousUser();
    }

    fetchAnonymousUser = async () => {
      let authUser = null;
      // NOTE: It's always have to avoid to replace console logged in user, or you may experience unwanted logout from console.
      if (this.props.authUser) {
        authUser = this.props.authUser;
      } else {
        authUser = await this.props.firebase
          .doSignInAnonymously()
          .then(snapshot => snapshot.user);
      }
      this.setState({ authUser });
    };

    render() {
      return this.state.authUser ? (
        <Component {...this.props} authUser={this.state.authUser} />
      ) : null;
    }
  }

  // NOTE: It's always required to check if it's logged in with withAuthentication
  return withAuthentication(withAuthUser(WithAnonymous));
};

export default withAnonymous;
