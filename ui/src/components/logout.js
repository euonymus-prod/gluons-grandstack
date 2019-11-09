// react
import React, { Component } from "react";
import { withFirebase } from "../providers/firebase";
import { withAuthUser } from "../providers/session";
import Button from "@material-ui/core/Button";

class Logout extends Component {
  render() {
    if (this.props.authUser) {
      return (
        <Button color="inherit" onClick={this.props.firebase.doSignOut}>
          Logout
        </Button>
      );
    }
    return null;
  }
}

export default withAuthUser(withFirebase(Logout));
