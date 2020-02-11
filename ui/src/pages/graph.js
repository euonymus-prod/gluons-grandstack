// react
import React, { Component } from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
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
  componentDidUpdate(prevProps) {
    document.title =
      this.props.match.params.quark_name +
      " -\n" +
      this.props.intl.formatMessage({
        id: "noun_gluons",
        defaultMessage: "gluons"
      });
  }

  render() {
    const [queryName, GRAPH_ON_QUARK] = new GraphOnQuark();

    const { authUser } = this.props;
    const variables = {
      name: this.props.match.params.quark_name,
      user_id: authUser ? authUser.uid : "",
      is_admin: authUser ? authUser.is_admin : false
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
Graph.propTypes = {
  intl: PropTypes.object.isRequired
};
export default connect(state => state, { setCurrentQuark })(
  withAuthUser(injectIntl(Graph))
);
