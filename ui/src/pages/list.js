// react
import React, { Component } from "react";
import { withAuthUser } from "../providers/session";
// GraphQL
import { Query } from "react-apollo";
import QuarkList from "../queries/quark-list";
import { querySelector } from "../utils/auth-util";
// component
import Quarks from "../components/quarks";
// constancts
import * as QUERY_NAME from "../constants/query-names";

const rowsPerPage = 100;
class Search extends Component {
  componentDidMount() {
    document.title = `Quark list -\ngluons`;
  }

  render() {
    const { authUser } = this.props;
    const [queryName, user_id] = querySelector(
      authUser,
      QUERY_NAME.READER_QUARKS,
      QUERY_NAME.USER_QUARKS,
      QUERY_NAME.ADMIN_QUARKS
    );

    const variables = {
      first: rowsPerPage
    };
    const quark_property_caption = "Quark List";
    const GRAPHQL_QUERY = new QuarkList(queryName, user_id);
    return (
      <div className="container">
        <h2>{quark_property_caption}</h2>
        <Query query={GRAPHQL_QUERY} variables={variables}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            const quarks = data[queryName];
            return <Quarks quarks={quarks} />;
          }}
        </Query>
      </div>
    );
  }
}
export default withAuthUser(Search);
