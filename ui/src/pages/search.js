// react
import React, { Component } from "react";
import { withAuthUser } from "../providers/session";
// GraphQL
import QuarkListSearched from "../queries/query-quark-list-searched";
// component
import Quarks from "../components/quarks";

const QUARKS_PER_PAGE = 100;
class Search extends Component {
  componentDidMount() {
    document.title = `Search Result of ${this.props.match.keyword} -\ngluons`;
  }

  render() {
    const [queryName, GRAPHQL_QUERY] = new QuarkListSearched(this.props);
    const { keyword } = this.props.match.params;
    const variables = {
      first: QUARKS_PER_PAGE,
      keyword
    };
    const quark_property_caption = keyword;
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
