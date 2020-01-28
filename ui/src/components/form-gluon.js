import _ from "lodash";
import React, { Component, Fragment } from "react";
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
      gluon_type_id: ""
    }
  };

  componentDidMount() {
    const { editingGluon } = this.props;
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
    const avoid2Edit = [
      "active_id",
      "passive_id",
      "active",
      "passive",
      "object_id"
    ];
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
    const { editingGluon } = this.props;
    return (
      <div className="container">
        <fieldset>
          <legend>Gluon Form</legend>
          <div className="form-group">
            <label>Gluon Type</label>
            <InputGluonTypes
              onChange={this.setFormVariables}
              defaultValue={formVariables.gluon_type_id}
            />
            <br />
            <br />
            {/*this.inputText("Quark you glue", "passive")*/}
            {!editingGluon && (
              <Fragment>
                <label>Quark you glue</label>
                <InputGluedQuark onChange={this.setFormVariables} />
                <br />
                <br />
              </Fragment>
            )}
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
  targetQuark: PropTypes.object,
  editingGluon: PropTypes.object
};
export default GluonForm;
