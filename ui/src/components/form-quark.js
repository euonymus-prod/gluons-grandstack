import React, { Component, Fragment } from "react";
import InputText from "./input-text";
import InputCheckbox from "./input-checkbox";
import InputQuarkLabels from "./input-quark-labels";
import SubmitQuark from "./submit-quark";

class QuarkFormBase extends Component {
  state = {
    error: null,
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
      quark_type_id: ""
    }
  };

  setFormVariables = (key, value) => {
    this.setState({
      formVariables: { ...this.state.formVariables, [key]: value }
    });
  };

  inputText = (title, name, type = "text") => {
    return (
      <InputText
        title={title}
        name={name}
        onChange={this.setFormVariables}
        type={type}
      />
    );
  };
  inputCheckbox = (title, name) => {
    return (
      <InputCheckbox
        title={title}
        name={name}
        onChange={this.setFormVariables}
      />
    );
  };

  render() {
    const { error, formVariables } = this.state;
    const { name } = formVariables;
    const isInvalid = name === "";
    return (
      <div>
        <div className="container">
          <fieldset>
            <legend>Add New Quark</legend>
            <div className="form-group">
              {this.inputText("Name", "name")}
              {this.inputText("Image Path", "image_path")}
            </div>
            <div className="form-group">
              <h4>optional</h4>
              {this.inputText("Description", "description")}
              {this.inputText("Start", "start", "date")}
              {this.inputText("End", "end", "date")}
              {this.inputText("Start Accuracy", "start_accuracy")}
              {this.inputText("End Accuracy", "end_accuracy")}
              {this.inputCheckbox("Is Momentary", "is_momentary")}

              {this.inputText("URL", "url")}
              {this.inputText("Affiliate URL", "affiliate")}
              <br />
              <label>Quark Type</label>
              <InputQuarkLabels onChange={this.setFormVariables} />
              {this.inputCheckbox("Is Private", "is_private")}
              {this.inputCheckbox("Is Exclusive", "is_exclusive")}
            </div>
          </fieldset>
          <SubmitQuark formVariables={formVariables} />
        </div>
      </div>
    );
  }
}
const QuarkForm = QuarkFormBase;
export default QuarkForm;
