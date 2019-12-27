// react
import React, { Component } from "react";
import { withAuthUser } from "../providers/session";
import { QUARK_LIST } from "../queries/quark-list";
// component
import Quarks from "../components/quarks";

const rowsPerPage = 100;
class Search extends Component {
  componentDidMount() {
    document.title = `Quark list -\ngluons`;
  }

  render() {
    // console.log(this.props.authUser);
    const variables = {
      first: rowsPerPage
    };
    const quark_property_caption = "Quark List";
    return (
      <div className="container">
        <h2>{quark_property_caption}</h2>
        <Quarks query={QUARK_LIST} variables={variables} />
      </div>
    );
  }
}
export default withAuthUser(Search);
