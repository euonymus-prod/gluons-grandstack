import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

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

  _onChange = e => {
    this.setState({ value: e.target.value });
    this.props.onChange(e.target.value);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.value) {
      let value = 1;
      if (nextProps.defaultValue) {
        value = nextProps.defaultValue;
      }
      nextProps.onChange(value);
      return { value };
    }
    return null;
  }

  render() {
    return (
      <Query query={QUARK_TYPES_QUERY} variables={{}}>
        {({ loading, error, data }) => {
          if (loading) return "Loading";
          if (error) return "Error";
          if (data.quarkLabels.length === 0)
            return "No Data for this Selectbox";

          return (
            <select value={this.props.defaultValue} onChange={this._onChange}>
              {data.quarkLabels.map((data, index) => (
                <option key={data.id} value={data.id}>
                  {data.id}: {data.label}
                </option>
              ))}
            </select>
          );
        }}
      </Query>
    );
  }
}
export default InputQuarkLabels;
