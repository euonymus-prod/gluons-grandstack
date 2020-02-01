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

export const GLUON_TYPES_QUERY = gql`
  query FeedQuery {
    gluonTypes {
      id
      type
      caption
      caption_ja
    }
  }
`;

class InputGluonTypes extends Component {
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
    this.props.onChange({ gluon_type_id: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <Query query={GLUON_TYPES_QUERY} variables={{}}>
        {({ loading, error, data }) => {
          if (loading) return "Loading";
          if (error) return "Error";
          if (data.gluonTypes.length === 0) return "No Data for this Selectbox";

          return (
            <FormControl variant="outlined" className={classes.formControl}>
              <label>Gluon Type</label>
              <Select
                value={this.props.defaultValue}
                onChange={this.onChange}
                className={classes.input}
              >
                {[
                  <MenuItem key="x" value="0">
                    -- Select One --
                  </MenuItem>,
                  ...data.gluonTypes.map((data, index) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.id}: {data.type}
                    </MenuItem>
                  ))
                ]}
              </Select>
            </FormControl>
          );
        }}
      </Query>
    );
  }
}
InputGluonTypes.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onChange: PropTypes.func.isRequired
};
InputGluonTypes.defaultProps = {
  defaultValue: 0
};
export default withStyles(styles)(InputGluonTypes);
// {
//   const list = data.gluonTypes.map((data, index) => (
//     <option key={data.id} value={data.id}>
//       {data.id}: {data.type}
//     </option>
//   ))
//   list.unshift("<option key="x" value="0">-- Select One --</option>")
//   return list
// }
