import React from "react";
import { withAuthorization, withAuthUser } from "../providers/session";

class Loggedin extends React.Component {
  render() {
    const { emailVerified, isAnonymous } = this.props.authUser;

    return (
      <div>
        <h1>You are logged in</h1>
        {isAnonymous ? (
          <p>You are anonymously logged in</p>
        ) : emailVerified ? (
          <p>Your email has been verified</p>
        ) : (
          <p>Your email is not verified</p>
        )}
      </div>
    );
  }
}

const condition = authUser => !!authUser;
export default withAuthUser(withAuthorization(condition)(Loggedin));
