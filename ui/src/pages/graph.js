// react
import React, { Component } from "react";
// GraphQL
import { Query } from "react-apollo";
import { GRAPH_ON_QUARK } from "../queries/graph-on-quark";
// component
import MainQuark from "../components/main-quark";
import Gluons from "../components/gluons";

console.log(GRAPH_ON_QUARK);
// GraphQL
class Graph extends Component {
  render() {
    const variables = {
      name: this.props.match.params.quark_name
    };
    return (
      <Query query={GRAPH_ON_QUARK} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          return (
            <div className="baryon-body">
              <MainQuark subject={data.quark} />
              <Gluons parentQuark={data.quark} hasSecondLevel={true} />
            </div>
          );
        }}
      </Query>
    );
  }
}
export default Graph;
