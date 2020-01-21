import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

class InputText extends Component {
  state = {
    value: ""
  };

  onChange = event => {
    this.setState({ value: event.target.value });
    this.props.onChange(event.target.name, event.target.value);
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
  value: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};
InputText.defaultProps = {
  value: "",
  type: "text"
};
export default InputText;
