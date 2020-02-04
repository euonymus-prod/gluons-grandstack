// react
import React, { Component } from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import { withAuthUser } from "../providers/session";
// GraphQL
import QuarkList from "../queries/query-quark-list";
// component
import Quarks from "../components/quarks";

const QUARKS_PER_PAGE = 100;
class Search extends Component {
  componentDidMount() {
    document.title =
      "Quarks -\n" +
      this.props.intl.formatMessage({
        id: "noun_gluons",
        defaultMessage: "gluons"
      });
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
Search.propTypes = {
  intl: PropTypes.object.isRequired
};
export default withAuthUser(injectIntl(Search));
