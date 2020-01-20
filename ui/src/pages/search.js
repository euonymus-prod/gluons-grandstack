// react
import React, { Component } from "react";
import { withAuthUser } from "../providers/session";
// GraphQL
import QuarkListSearched from "../queries/query-quark-list-searched";
import { querySelector } from "../utils/auth-util";
// component
import Quarks from "../components/quarks";
// constancts
import * as QUERY_NAME from "../constants/query-names";

const rowsPerPage = 100;
class Search extends Component {
  componentDidMount() {
    document.title = `Search Result of ${this.props.match.keyword} -\ngluons`;
  }

  render() {
    const { authUser } = this.props;
    const [queryName, user_id] = querySelector(
      authUser,
      QUERY_NAME.READER_SEARCH_QUARKS,
      QUERY_NAME.USER_SEARCH_QUARKS,
      QUERY_NAME.ADMIN_SEARCH_QUARKS
    );

    const { keyword } = this.props.match.params;
    const variables = {
      first: rowsPerPage,
      keyword
    };
    const quark_property_caption = keyword;
    const GRAPHQL_QUERY = new QuarkListSearched(queryName, user_id);
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
