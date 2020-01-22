import React, { Component } from "react";
import PropTypes from "prop-types";
import InputText from "./input-text";
import InputCheckbox from "./input-checkbox";
import InputQuarkLabels from "./input-quark-labels";
import SubmitQuark from "./submit-quark";
import Util from "../utils/common";

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
      quark_type_id: ""
    }
  };

  componentDidMount() {
    const { editingQuark } = this.props;
    if (editingQuark) {
      const util = new Util();
      const start = util.date2str({
        ...editingQuark.start,
        month: editingQuark.start.month - 1
      });
      const end = util.date2str({
        ...editingQuark.end,
        month: editingQuark.end.month - 1
      });
      this.setFormVariables({ ...editingQuark, start, end });
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
              <InputQuarkLabels
                onChange={this.setFormVariables}
                defaultValue={this.state.formVariables.quark_type_id}
              />
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
QuarkForm.propTypes = {
  editingQuark: PropTypes.object
};
export default QuarkForm;
