// react
import React, { Component } from "react";
import { withAuthUser } from "../providers/session";
import { QUARK_LIST_SEARCHED } from "../queries/quark-list-searched";
// component
import Quarks from "../components/quarks";

const rowsPerPage = 100;
class Search extends Component {
  componentDidMount() {
    document.title = `Search Result of ${this.props.match.keyword} -\ngluons`;
  }

  render() {
    if (this.props.authUser) {
      console.log(this.props.authUser["idToken"]);
    }
    const { keyword } = this.props.match.params;
    const variables = {
      first: rowsPerPage,
      keyword
    };
    const quark_property_caption = keyword;
    return (
      <div className="container">
        <h2>{quark_property_caption}</h2>
        <Quarks query={QUARK_LIST_SEARCHED} variables={variables} />
      </div>
    );
  }
}
export default withAuthUser(Search);
