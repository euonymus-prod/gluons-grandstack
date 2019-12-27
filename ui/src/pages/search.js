// react
import React, { Component } from "react";
import { withAuthUser } from "../providers/session";
// GraphQL
import { Query } from "react-apollo";
import QuarkListSearched from "../queries/quark-list-searched";
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
    let queryName = QUERY_NAME.READER_SEARCH_QUARKS;
    let user_id = null;
    if (authUser) {
      if (authUser.is_admin) {
        queryName = QUERY_NAME.ADMIN_SEARCH_QUARKS;
      } else {
        queryName = QUERY_NAME.USER_SEARCH_QUARKS;
        user_id = authUser.uid;

        // TODO: ------------------------------
        if (user_id === "qV183nzQ79MPRBidNFTCbUxCv1H2") {
          user_id = 2;
        }
        // ------------------------------------
      }
    }
    const { keyword } = this.props.match.params;
    const variables = {
      first: rowsPerPage,
      keyword
    };
    const quark_property_caption = keyword;
    const QUARK_LIST_SEARCHED = new QuarkListSearched(queryName, user_id);
    return (
      <div className="container">
        <h2>{quark_property_caption}</h2>
        <Query query={QUARK_LIST_SEARCHED} variables={variables}>
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
