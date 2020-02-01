// react
import React, { Component } from "react";
// redux
import { connect } from "react-redux";
import { setCurrentQuark } from "../actions/quark.js";
// GraphQL
import { Query } from "react-apollo";
import { withAuthUser } from "../providers/session";
import GraphOnQuark from "../queries/query-graph-on-quark";
// component
import MainQuark from "../components/main-quark";
import Gluons from "../components/gluons";

// GraphQL
class Graph extends Component {
  render() {
    const [queryName, GRAPH_ON_QUARK] = new GraphOnQuark(this.props);
    const variables = {
      name: this.props.match.params.quark_name
    };
    return (
      <Query query={GRAPH_ON_QUARK} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          if (!data || !data[queryName]) return "No Quark was found";
          this.props.setCurrentQuark(data[queryName]);
          return (
            <div className="baryon-body">
              <MainQuark subject={data[queryName]} />
              <Gluons parentQuark={data[queryName]} hasSecondLevel={true} />
            </div>
          );
        }}
      </Query>
    );
  }
}
export default connect(state => state, { setCurrentQuark })(
  withAuthUser(Graph)
);
