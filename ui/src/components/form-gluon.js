import React, { Component } from "react";
import InputText from "./input-text";
import InputCheckbox from "./input-checkbox";
import InputQuarkLabels from "./input-quark-labels";
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
      <div>
        <div className="container">
          <fieldset>
            <legend>Add New Quark</legend>
            <div className="form-group">
              <label>Gluon Type</label>
              <InputQuarkLabels onChange={this.setFormVariables} />
              <br />
              <br />
              {this.inputText("Quark you glue", "passive")}
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
      </div>
    );
  }
}
export default GluonForm;
