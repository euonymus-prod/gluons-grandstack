import React, { Component } from "react";
import PropTypes from "prop-types";
import InputText from "./input-text";
import InputCheckbox from "./input-checkbox";
import InputGluonTypes from "./input-gluon-types";
import InputGluedQuark from "./input-glued-quark";
import SubmitGluon from "./submit-gluon";
import Util from "../utils/common";

class GluonForm extends Component {
  state = {
    // error: null,
    targetQuark: null,
    formVariables: {
      active_id: "",
      passive_id: "",
      passive: "",
      prefix: "",
      relation: "",
      suffix: "",
      start: "",
      end: "",
      start_accuracy: "",
      end_accuracy: "",
      is_momentary: false,
      is_exclusive: false,
      gluon_type_id: ""
    }
  };

  componentDidMount() {
    const { targetQuark, editingGluon } = this.props;
    const active_id = targetQuark.id;
    let formVariables = {};
    if (editingGluon) {
      const util = new Util(false);
      const start = util.date2str(editingGluon.start);
      const end = util.date2str(editingGluon.end);
      formVariables = { ...editingGluon, active_id, start, end };
    } else {
      formVariables = { active_id };
    }
    this.setFormVariables(formVariables);
    this.setState({ targetQuark });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { targetQuark } = nextProps;
    if (!prevState.targetQuark || targetQuark.id !== prevState.targetQuark.id) {
      return {
        formVariables: { ...prevState.formVariables, active_id: targetQuark.id }
      };
    }
    return null;
  }

  setFormVariables = newVariables => {
    this.setState({
      formVariables: { ...this.state.formVariables, ...newVariables }
    });
  };

  inputText = (title, name, type = "text") => {
    return (
      <InputText
        title={title}
        name={name}
        onChange={this.setFormVariables}
        type={type}
        defaultValue={this.state.formVariables[name]}
      />
    );
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
    const { targetQuark, formVariables } = this.state;
    return (
      <div className="container">
        <fieldset>
          <legend>Add New Gluon</legend>
          <div className="form-group">
            <label>Gluon Type</label>
            <InputGluonTypes
              onChange={this.setFormVariables}
              defaultValue={this.state.formVariables.gluon_type_id}
            />
            <br />
            <br />
            {/*this.inputText("Quark you glue", "passive")*/}
            <label>Quark you glue</label>
            <InputGluedQuark onChange={this.setFormVariables} />
            <br />
            <br />
            {this.inputText("Prefix", "prefix")}
            {this.inputText("Relation", "relation")}
            {this.inputText("Suffix", "suffix")}
          </div>
          <div className="form-group">
            <h4>optional</h4>
            {this.inputText("Start", "start", "date")}
            {this.inputText("End", "end", "date")}
            {this.inputText("Start Accuracy", "start_accuracy")}
            {this.inputText("End Accuracy", "end_accuracy")}
            {this.inputCheckbox("Is Momentary", "is_momentary")}
            <br />
            {this.inputCheckbox("Is Exclusive", "is_exclusive")}
          </div>
        </fieldset>
        <SubmitGluon targetQuark={targetQuark} formVariables={formVariables} />
      </div>
    );
  }
}
GluonForm.propTypes = {
  targetQuark: PropTypes.object.isRequired,
  editingGluon: PropTypes.object
};
export default GluonForm;
