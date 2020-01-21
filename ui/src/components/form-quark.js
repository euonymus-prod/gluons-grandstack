import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { Mutation } from "react-apollo";
import InputQuarkLabels from "./input-quark-labels";
import { POST_MUTATION } from "../queries/mutation-quark";
import SubmitQuark from "./submit-quark";
// Material UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const QUARKS_PER_PAGE = 20;
// TODO
const QUARKS_QUERY = "";

const INITIAL_STATE = {
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

class QuarkFormBase extends Component {
  state = { ...INITIAL_STATE };

  setFormVariables = (key, value) => {
    this.setState({
      formVariables: { ...this.state.formVariables, [key]: value }
    });
  };
  onChange = event => {
    this.setFormVariables([event.target.name], event.target.value);
  };
  onChangeCheckbox = event => {
    this.setFormVariables([event.target.name], !this.state[event.target.name]);
  };

  inputText = (title, key, type = "text") => {
    return (
      <Fragment>
        <label>{title}</label>
        <input
          value={this.state[key]}
          name={key}
          onChange={this.onChange}
          type={type}
          placeholder={title}
          className={`form-control ${type}`}
        />
      </Fragment>
    );
  };
  inputCheckbox = (title, key) => {
    return (
      <div className="input checkbox">
        <label htmlFor={key}>
          <input
            name={key}
            onChange={this.onChangeCheckbox}
            type="checkbox"
            checked={this.state[key]}
          />
          {title}
        </label>
      </div>
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
              <InputQuarkLabels
                onChange={quark_type_id =>
                  this.setFormVariables("quark_type_id", quark_type_id)
                }
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
const QuarkForm = withRouter(withLastLocation(QuarkFormBase));
export default QuarkForm;
