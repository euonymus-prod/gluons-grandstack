import _ from "lodash";
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// import InputText from "./input-text";
import InputCheckbox from "./input-checkbox";
import InputGluonTypes from "./input-gluon-types";
import InputGluedQuark from "./input-glued-quark";
import SubmitGluon from "./submit-gluon";
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

class GluonForm extends Component {
  state = {
    // error: null,
    targetQuark: null,
    formVariables: {
      // active_id: "",
      // passive_id: "",
      // passive: "",
      prefix: "",
      relation: "",
      suffix: "",
      start: "",
      end: "",
      start_accuracy: "",
      end_accuracy: "",
      is_momentary: false,
      is_exclusive: false,
      gluon_type_id: "0"
    }
  };

  componentDidMount() {
    const newState = GluonForm.generateInitialState(this.props, this.state);
    this.setState(newState);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const targetQuark = GluonForm.getTargetQuark(nextProps);
    if (
      GluonForm.isTargetEmpty(prevState) ||
      targetQuark.id !== prevState.targetQuark.id
    ) {
      const newState = GluonForm.generateInitialState(nextProps, prevState);
      return newState;
    }
    return null;
  }

  setFormVariables = newVariables => {
    const formVariables = GluonForm.generateNewFormVariables(
      newVariables,
      this.state
    );
    this.setState({ formVariables });
  };

  static generateInitialState = (nextProps, prevState) => {
    const avoid2Edit = ["active_id", "passive_id", "active", "passive"];
    const { editingGluon } = nextProps;
    const targetQuark = GluonForm.getTargetQuark(nextProps);
    if (!targetQuark) {
      return false;
    }

    let newVariables = null;
    if (editingGluon) {
      const util = new Util(false);
      const start = util.date2str(editingGluon.start);
      const end = util.date2str(editingGluon.end);
      newVariables = { ..._.omit(editingGluon, avoid2Edit), start, end };
    } else {
      const active_id = targetQuark.id;
      newVariables = { active_id };
    }
    const formVariables = GluonForm.generateNewFormVariables(
      newVariables,
      prevState
    );
    return { targetQuark, formVariables };
  };

  static generateNewFormVariables = (newVariables, prevState) => {
    return { ...prevState.formVariables, ...newVariables };
  };

  static isTargetEmpty = state => {
    return !state.targetQuark;
  };

  static getTargetQuark = props => {
    const { targetQuark, editingGluon } = props;
    if (targetQuark) {
      return targetQuark;
    } else if (editingGluon.active) {
      return editingGluon.active;
    }
    return false;
  };

  inputText = (title, name, type = "text") => {
    const { classes } = this.props;
    const requireds = ["relation"];
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
    const { targetQuark, formVariables } = this.state;
    const { editingGluon } = this.props;
    return (
      <Fragment>
        <div className="form-group">
          <InputGluonTypes
            onChange={this.setFormVariables}
            defaultValue={formVariables.gluon_type_id}
          />
          <br />
          {/*this.inputText("Quark you glue", "passive")*/}
          {!editingGluon && (
            <Fragment>
              <InputGluedQuark onChange={this.setFormVariables} />
            </Fragment>
          )}
          <FormControl className={classes.each}>
            {this.inputText("Prefix", "prefix")}
            {this.inputText("Relation", "relation")}
            {this.inputText("Suffix", "suffix")}
          </FormControl>
        </div>
        <div className="form-group">
          <FormControl className={classes.each}>
            {this.inputText("Start", "start", "date")}
            {this.inputText("Accuracy", "start_accuracy")}
          </FormControl>
          <FormControl className={classes.each}>
            {this.inputText("End", "end", "date")}
            {this.inputText("Accuracy", "end_accuracy")}
          </FormControl>
          {this.inputCheckbox("Is Momentary", "is_momentary")}
          {this.inputCheckbox("Is Exclusive", "is_exclusive")}
          <br />
        </div>

        <SubmitGluon targetQuark={targetQuark} formVariables={formVariables} />
      </Fragment>
    );
  }
}
GluonForm.propTypes = {
  targetQuark: PropTypes.object,
  editingGluon: PropTypes.object
};
export default withStyles(styles)(GluonForm);
