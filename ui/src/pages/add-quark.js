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
  error: null,
  name: "",
  image_path: "",
  description: "",
  start: "",
  end: "",
  start_accuracy: "",
  end_accuracy: "",
  is_momentary: false,
  url: "",
  affiliate: "",
  is_private: false,
  is_exclusive: true,
  quark_type_id: "",
  auto_fill: true
};

class AddNewQuarkFormBase extends React.Component {
  state = { ...INITIAL_STATE };

  onSubmit = event => {
    const { email, password } = this.state;

    // this.props.firebase
    //   .doSignInWithEmailAndPassword(email, password)
    //   .then(() => {
    //     this.setState({ ...INITIAL_STATE });
    //     const { lastLocation } = this.props;
    //     let redirectLocation = "/";
    //     if (
    //       lastLocation &&
    //       lastLocation.pathname !== "/signup" &&
    //       lastLocation.pathname !== "/login"
    //     ) {
    //       redirectLocation = lastLocation;
    //     }
    //     this.props.history.push(redirectLocation);
    //   })
    //   .catch(error => {
    //     this.setState({ error });
    //   });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      error,
      name,
      image_path,
      description,
      start,
      end,
      start_accuracy,
      end_accuracy,
      is_momentary,
      url,
      affiliate,
      is_private,
      is_exclusive,
      quark_type_id,
      auto_fill
    } = this.state;
    const isInvalid = name === "";

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="outlined-name"
          name="name"
          label="Name"
          value={name}
          onChange={this.onChange}
          variant="outlined"
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
