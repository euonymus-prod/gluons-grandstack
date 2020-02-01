// react
import React, { Component } from "react";
import { withAuthUser } from "../providers/session";
// GraphQL
import QuarkList from "../queries/query-quark-list";
// component
import Quarks from "../components/quarks";

const QUARKS_PER_PAGE = 100;
class Search extends Component {
  componentDidMount() {
    document.title = `Quark list -\ngluons`;
  }

  render() {
    const [queryName, GRAPHQL_QUERY] = new QuarkList(this.props);
    const variables = {
      first: QUARKS_PER_PAGE
    };
    const quark_property_caption = "Quark List";
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
