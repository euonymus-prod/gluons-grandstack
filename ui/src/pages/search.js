// react
import React, { Component } from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import { withAuthUser } from "../providers/session";
// GraphQL
import QuarkListSearched from "../queries/query-quark-list-searched";
// component
import Quarks from "../components/quarks";

const QUARKS_PER_PAGE = 100;
class Search extends Component {
  componentDidMount() {
    document.title =
      `Search Result of ${this.props.match.keyword} -\n` +
      this.props.intl.formatMessage({
        id: "noun_gluons",
        defaultMessage: "gluons"
      });
  }

  render() {
    const [queryName, GRAPHQL_QUERY] = new QuarkListSearched();
    const { keyword } = this.props.match.params;

    const { authUser } = this.props;
    const variables = {
      first: QUARKS_PER_PAGE,
      keyword,
      user_id: authUser ? authUser.uid : "",
      is_admin: authUser ? authUser.is_admin : false
    };
    const quark_property_caption = this.props.intl.formatMessage(
      {
        id: "title_search_list",
        defaultMessage: `Search result of { keyword }`
      },
      { keyword }
    );
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
