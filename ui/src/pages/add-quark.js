import React from "react";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { withFirebase } from "../providers/firebase";
// Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const AddNewQuark = () => (
  <div className="AddNewQuark">
    <h1>Add New Quark</h1>
    <AddNewQuarkForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class AddNewQuarkFormBase extends React.Component {
  state = { ...INITIAL_STATE };

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        const { lastLocation } = this.props;
        let redirectLocation = "/";
        if (
          lastLocation &&
          lastLocation.pathname !== "/signup" &&
          lastLocation.pathname !== "/login"
        ) {
          redirectLocation = lastLocation;
        }
        this.props.history.push(redirectLocation);
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
          Submit
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
export default AddNewQuark;

const AddNewQuarkForm = withRouter(
  withFirebase(withLastLocation(AddNewQuarkFormBase))
);
export { AddNewQuarkForm };
