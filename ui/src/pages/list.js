// react
import React, { Component } from "react";
import { withAuthUser } from "../providers/session";
// GraphQL
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
      <Quarks
        quark_property_caption={quark_property_caption}
        graphqlQuery={GRAPHQL_QUERY}
        variables={variables}
        queryName={queryName}
      />
    );
  }
}
export default withAuthUser(Search);
