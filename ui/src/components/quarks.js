// react
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import Util from "../utils/common";
// component
import QuarkInList from "./quark-in-list";

const util = new Util(false);

class Quarks extends Component {
  render() {
    const {
      quark_property_caption,
      graphqlQuery,
      variables,
      queryName
    } = this.props;
    return (
      <div className="container quark-list-container">
        <h2>{quark_property_caption}</h2>
        <Query query={graphqlQuery} variables={variables}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            const quarks = data[queryName];
            return (
              <div>
                {quarks.map(quark => {
                  quark.name = util.localedProp(quark, "name");
                  quark.description = util.localedProp(quark, "description");
                  return <QuarkInList key={quark.id} data={quark} />;
                })}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
Quarks.propTypes = {
  quark_property_caption: PropTypes.string.isRequired,
  graphqlQuery: PropTypes.object.isRequired,
  variables: PropTypes.object.isRequired,
  queryName: PropTypes.string.isRequired
};
export default Quarks;
