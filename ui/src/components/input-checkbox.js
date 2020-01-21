import React, { Component } from "react";
import PropTypes from "prop-types";

class InputCheckbox extends Component {
  state = {
    value: ""
  };

  onChange = event => {
    this.setState({ value: !this.state.value });
    this.props.onChange(event.target.name, !this.state.value);
  };

  render() {
    const { title, name } = this.props;
    return (
      <div className="input checkbox">
        <label htmlFor={name}>
          <input
            name={name}
            onChange={this.onChange}
            type="checkbox"
            checked={this.state.value}
          />
          {title}
        </label>
      </div>
    );
  }
}

InputCheckbox.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
export default InputCheckbox;
