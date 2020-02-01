import React, { Component } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";
// Material UI
import { withStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

const styles = theme => ({
  input: {
    width: "200px",
    backgroundColor: "#fff"
  }
});

export const QUARK_TYPES_QUERY = gql`
  query FeedQuery {
    quarkLabels {
      id
      label
      sort
    }
  }
`;

class InputQuarkLabels extends Component {
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
    this.setState({ value: event.target.value });
    this.props.onChange({ quark_type_id: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <Query query={QUARK_TYPES_QUERY} variables={{}}>
        {({ loading, error, data }) => {
          if (loading) return "Loading";
          if (error) return "Error";
          if (data.quarkLabels.length === 0)
            return "No Data for this Selectbox";

          return (
            <FormControl variant="outlined" className={classes.formControl}>
              <label>Quark Type</label>
              <Select
                value={this.props.defaultValue}
                onChange={this.onChange}
                className={classes.input}
              >
                {data.quarkLabels.map((data, index) => (
                  <MenuItem key={data.id} value={data.id}>
                    {data.id}: {data.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }}
      </Query>
    );
  }
}
InputQuarkLabels.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onChange: PropTypes.func.isRequired
};
InputQuarkLabels.defaultProps = {
  defaultValue: "1"
};
export default withStyles(styles)(InputQuarkLabels);
