import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { withFirebase } from "../providers/firebase";
import * as ROUTES from "../constants/routes";
// Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Signup = () => (
  <div className="Signup">
    <h1>Sign Up</h1>
    <SignupForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignupFormBase extends Component {
  state = { ...INITIAL_STATE };

  onSubmit = event => {
    const { email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firestore database
        return this.props.firebase.user(authUser.user.uid).set({
          email,
          is_approved: false,
          is_admin: false
        });
      })
      .then(() => {
        const domain = process.env.REACT_APP_DOMAIN;
        const url = `https://${domain}${ROUTES.EMAIL_VERIFIED}`;
        return this.props.firebase.doSendEmailVerification(url);
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LOGGED_IN);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === "" || email === "";

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="outlined-email"
          name="email"
          label="Email"
          value={email}
          onChange={this.onChange}
          variant="outlined"
        />
        <br />
        <br />
        <TextField
          id="outlined-password-one"
          name="passwordOne"
          label="Password"
          value={passwordOne}
          onChange={this.onChange}
          variant="outlined"
          type="password"
        />
        <br />
        <br />
        <TextField
          id="outlined-password-two"
          name="passwordTwo"
          label="Confirm Password"
          value={passwordTwo}
          onChange={this.onChange}
          variant="outlined"
          type="password"
        />
        <br />
        <br />
        <Button disabled={isInvalid} variant="contained" type="submit">
          Sign Up
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignupLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignupForm = withRouter(withFirebase(SignupFormBase));

export default Signup;

export { SignupForm, SignupLink };
