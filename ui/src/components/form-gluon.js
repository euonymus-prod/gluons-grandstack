import React, { Component } from "react";
import PropTypes from "prop-types";
import InputText from "./input-text";
import InputCheckbox from "./input-checkbox";
import InputGluonTypes from "./input-gluon-types";
import InputGluedQuark from "./input-glued-quark";
import SubmitQuark from "./submit-quark";
import Util from "../utils/common";

class GluonForm extends Component {
  state = {
    // error: null,
    formVariables: {
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
    const { editingGluon } = this.props;
    if (editingGluon) {
      const util = new Util(false);
      const start = util.date2str(editingGluon.start);
      const end = util.date2str(editingGluon.end);
      this.setFormVariables({ ...editingGluon, start, end });
    }
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
    const { formVariables } = this.state;
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
        <SubmitQuark formVariables={formVariables} />
      </div>
    );
  }
}
GluonForm.propTypes = {
  editingGluon: PropTypes.object
};
export default GluonForm;
