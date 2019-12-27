// react
import React, { Component } from "react";
import { withAuthUser } from "../providers/session";
// GraphQL
import { Query } from "react-apollo";
import QuarkList from "../queries/quark-list";
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
    let queryName = QUERY_NAME.READER_QUARKS;
    let user_id = null;
    if (authUser) {
      if (authUser.is_admin) {
        queryName = QUERY_NAME.ADMIN_QUARKS;
      } else {
        queryName = QUERY_NAME.USER_QUARKS;
        user_id = authUser.uid;

        // TODO: ------------------------------
        if (user_id === "qV183nzQ79MPRBidNFTCbUxCv1H2") {
          user_id = 2;
        }
        // ------------------------------------
      }
    }
    const variables = {
      first: rowsPerPage
    };
    const quark_property_caption = "Quark List";
    const QUARK_LIST = new QuarkList(queryName, user_id);
    return (
      <div className="container">
        <h2>{quark_property_caption}</h2>
        <Query query={QUARK_LIST} variables={variables}>
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
