import React from "react";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../providers/firebase";
// Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Login = () => (
  <div className="Login">
    <h1>Login</h1>
    <LoginForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class LoginFormBase extends React.Component {
  state = { ...INITIAL_STATE };

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push("/logged-in");
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";

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
          id="outlined-password"
          name="password"
          label="Password"
          value={password}
          onChange={this.onChange}
          variant="outlined"
          type="password"
        />
        <br />
        <br />
        <Button disabled={isInvalid} variant="contained" type="submit">
          Login
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const LoginForm = withRouter(withFirebase(LoginFormBase));

export default Login;

export { LoginForm };
