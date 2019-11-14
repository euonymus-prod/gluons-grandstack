// react
import React, { Component } from "react";
import PropTypes from "prop-types";
// GraphQL
import { Query } from "react-apollo";

// component
import QuarkInList from "./quark-in-list";

class Quarks extends Component {
  render() {
    const { query, variables } = this.props;
    return (
      <Query query={query} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          const quarks = data.searchQuarks || data.quarks;
          return (
            <div>
              {quarks.map(quark => {
                return <QuarkInList key={quark.id} data={quark} />;
              })}
            </div>
          );
        }}
      </Query>
    );
  }
}
Quarks.propTypes = {
  quark: PropTypes.string.isRequired,
  variables: PropTypes.object.isRequired
};
export default Quarks;
