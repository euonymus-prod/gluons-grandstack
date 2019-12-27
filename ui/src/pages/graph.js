// react
import React, { Component } from "react";
// GraphQL
import { Query } from "react-apollo";
import { withAuthUser } from "../providers/session";
import GraphOnQuark from "../queries/graph-on-quark";
import { querySelector } from "../utils/auth-util";
// component
import MainQuark from "../components/main-quark";
import Gluons from "../components/gluons";
// constancts
import * as QUERY_NAME from "../constants/query-names";

// GraphQL
class Graph extends Component {
  render() {
    const { authUser } = this.props;
    const [queryName, user_id] = querySelector(
      authUser,
      QUERY_NAME.READER_QUARK,
      QUERY_NAME.USER_QUARK,
      QUERY_NAME.ADMIN_QUARK
    );

    const variables = {
      name: this.props.match.params.quark_name
    };
    const GRAPH_ON_QUARK = new GraphOnQuark(queryName, user_id);
    return (
      <Query query={GRAPH_ON_QUARK} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
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
export default withAuthUser(Graph);
