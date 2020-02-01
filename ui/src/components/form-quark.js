import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// import InputText from "./input-text";
import InputCheckbox from "./input-checkbox";
import InputQuarkLabels from "./input-quark-labels";
import SubmitQuark from "./submit-quark";
import Util from "../utils/common";
// Material UI
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  root: {},
  each: {
    display: "block"
  },
  input: {
    width: "100%",
    backgroundColor: "#fff"
  },
  short: {
    width: "170px",
    backgroundColor: "#fff"
  },
  medium: {
    width: "100px",
    backgroundColor: "#fff"
  }
});

class QuarkForm extends Component {
  state = {
    // error: null,
    formVariables: {
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
      quark_type_id: "1"
    }
  };

  componentDidMount() {
    const { editingQuark } = this.props;
    if (editingQuark) {
      const util = new Util(false);
      const start = util.date2str(editingQuark.start);
      const end = util.date2str(editingQuark.end);
      this.setFormVariables({ ...editingQuark, start, end });
    }
  }

  setFormVariables = newVariables => {
    this.setState({
      formVariables: { ...this.state.formVariables, ...newVariables }
    });
  };

  inputText = (title, name, type = "text") => {
    const { classes } = this.props;
    const requireds = ["name"];
    const medium = ["start_accuracy", "end_accuracy"];
    const short = ["start", "end"];
    let className = classes.input;
    if (medium.includes(name)) {
      className = classes.medium;
    } else if (short.includes(name)) {
      className = classes.short;
    }
    const InputLabelProps = type === "date" ? { shrink: true } : null;
    const { required, color } = requireds.includes(name)
      ? { required: true, color: "secondary" }
      : { required: false, color: "primary" };
    return (
      <TextField
        className={className}
        onChange={event =>
          this.setFormVariables({ [event.target.name]: event.target.value })
        }
        margin="normal"
        variant="outlined"
        value={this.state.formVariables[name]}
        name={name}
        label={title}
        placeholder={`Type your ${name}`}
        type={type}
        InputLabelProps={InputLabelProps}
        required={required}
        color={color}
      />
    );
    // return (
    //   <InputText
    //     title={title}
    //     name={name}
    //     onChange={this.setFormVariables}
    //     type={type}
    //     defaultValue={this.state.formVariables[name]}
    //   />
    // );
  };
  inputCheckbox = (title, name) => {
    return (
      <InputCheckbox
        title={title}
        name={name}
        onChange={this.setFormVariables}
        defaultValue={this.state.formVariables[name]}
      />
    );
  };

  render() {
    const { classes } = this.props;
    const { formVariables } = this.state;
    return (
      <Fragment>
        <div className="form-group">
          <InputQuarkLabels
            onChange={this.setFormVariables}
            defaultValue={this.state.formVariables.quark_type_id}
          />
          <FormControl className={classes.each}>
            {this.inputText("Name", "name")}
          </FormControl>
          <FormControl className={classes.each}>
            {this.inputText("Image Path", "image_path")}
          </FormControl>
        </div>
        <div className="form-group">
          <FormControl className={classes.each}>
            {this.inputText("Description", "description")}
          </FormControl>
          <FormControl className={classes.each}>
            {this.inputText("Start", "start", "date")}
            {this.inputText("Accuracy", "start_accuracy")}
          </FormControl>
          <FormControl className={classes.each}>
            {this.inputText("End", "end", "date")}
            {this.inputText("Accuracy", "end_accuracy")}
          </FormControl>
          {this.inputCheckbox("Is Momentary", "is_momentary")}

          <FormControl className={classes.each}>
            {this.inputText("URL", "url")}
          </FormControl>
          <FormControl className={classes.each}>
            {this.inputText("Affiliate URL", "affiliate")}
          </FormControl>
          {this.inputCheckbox("Is Private", "is_private")}
          {this.inputCheckbox("Is Exclusive", "is_exclusive")}
          <br />
        </div>

        <SubmitQuark formVariables={formVariables} />
      </Fragment>
    );
  }
}
QuarkForm.propTypes = {
  editingQuark: PropTypes.object
};
export default withStyles(styles)(QuarkForm);
