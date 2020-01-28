import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

class InputText extends Component {
  state = {
    value: ""
  };

  componentDidMount() {
    if (this.props.defaultValue) {
      const value = InputText.sanitizedInputValue(this.props);
      this.setState({ value });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.value) {
      const value = InputText.sanitizedInputValue(nextProps);
      return { value };
    }
    return null;
  }

  static sanitizedInputValue = props => {
    return props.defaultValue ? props.defaultValue : "";
  };

  onChange = event => {
    this.setState({ value: event.target.value });
    this.props.onChange({ [event.target.name]: event.target.value });
  };

  render() {
    const { title, name, type } = this.props;
    return (
      <Fragment>
        <label>{title}</label>
        <input
          value={this.state.value}
          name={name}
          onChange={this.onChange}
          type={type}
          placeholder={title}
          className={`form-control ${type}`}
        />
      </Fragment>
    );
  }
}
InputText.propTypes = {
  defaultValue: PropTypes.string,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};
InputText.defaultProps = {
  defaultValue: "",
  type: "text"
};
export default InputText;
