import React, { Component } from "react";
// Material UI
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    margin: "0px",
    marginTop: "15px",
    display: "block",
    textAlign: "center"
  },
  input: {
    width: "380px"
  },
  button: {
    width: "180px"
  }
});
class Contact extends Component {
  state = {
    name: "",
    organization: "",
    department: "",
    email: "",
    message: "",
    topic: ""
  };

  componentDidMount() {
    document.title = "Contact Us -\nグルーオンズ";
  }

  notValid = () => {
    const requireds = [
      "name",
      "organization",
      "department",
      "email",
      "message",
      "topic"
    ];
    const hasEmpty = requireds.some(state => {
      if (!this.state[state]) {
        alert(`${state} is required`);
        return true;
      }
      return false;
    });
    if (hasEmpty) {
      return true;
    }
    if (!this.isValidEmail()) {
      alert(`Email address is not valid`);
      return true;
    }
    return false;
  };

  isValidEmail = () => {
    const regEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regEmail.test(this.state.email) === true;
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onClick = event => {
    event.preventDefault();
    if (this.notValid()) {
      return false;
    }

    console.log(2);
    console.log(this.state);
  };

  inputText = (name, label, multilineRow = false) => {
    const { classes } = this.props;
    return (
      <TextField
        className={classes.input}
        onChange={this.onChange}
        margin="normal"
        variant="outlined"
        value={this.state[name]}
        name={name}
        label={label}
        placeholder={`Type your ${name}`}
        required
        color="secondary"
        multiline={!!multilineRow}
        rows={multilineRow ? multilineRow : 1}
      />
    );
  };
  render() {
    const { classes } = this.props;

    return (
      <div className="container contact">
        <h1>Contact Us</h1>
        <p>
          Leverage your knowledge by seeking relations among things, people,
          ETC. If you’d like to know more about how we can help you, put down
          anything here.
        </p>
        <form className={classes.root} noValidate autoComplete="off">
          <FormControl>
            {this.inputText("name", "Name")}
            {this.inputText("organization", "Organization")}
            {this.inputText("department", "Department")}
            {this.inputText("email", "Email")}
            <br />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Topic
              </InputLabel>
              <Select
                value={this.state.topic}
                name="topic"
                onChange={this.onChange}
              >
                <MenuItem value="">
                  <em>-- Select a topic --</em>
                </MenuItem>
                <MenuItem value="About Service">About Service</MenuItem>
                <MenuItem value="Business Relationship">
                  Business Relationship
                </MenuItem>
                <MenuItem value="Media Coverage">Media Coverage</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            {this.inputText("message", "Message", 5)}

            <br />
            <Button
              onClick={this.onClick}
              className={classes.button}
              variant="contained"
              color="primary"
            >
              Contact Us
            </Button>
          </FormControl>
        </form>
      </div>
    );
  }
}
export default withStyles(styles)(Contact);
