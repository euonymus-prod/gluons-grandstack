import React, { Component } from "react";
import PropTypes from "prop-types";

class InputCheckbox extends Component {
  state = {
    value: ""
  };

  componentDidMount() {
    if (this.props.defaultValue) {
      this.setState({ value: this.props.defaultValue });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.value) {
      const value = nextProps.defaultValue;
      return { value };
    }
    return null;
  }

  onChange = event => {
    this.setState({ value: !this.state.value });
    this.props.onChange({ [event.target.name]: !this.state.value });
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
  defaultValue: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
InputCheckbox.defaultProps = {
  defaultValue: ""
};
export default InputCheckbox;
