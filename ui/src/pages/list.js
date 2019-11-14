// react
import React, { Component } from "react";
// GraphQL
import { Query } from "react-apollo";
import gql from "graphql-tag";

// component
import Quarks from "../components/quarks";

const rowsPerPage = 100;
const SEARCH_QUARKS = gql`
  query quarks {
    quarks {
      id
      name
      description
      image_path
    }
  }
`;

class Search extends Component {
  componentDidMount() {
    document.title = `Quark list -\ngluons`;
  }

  render() {
    const variables = {};
    const quark_property_caption = "Quark List";
    return (
      <div className="container">
        <h2>{quark_property_caption}</h2>
        <Quarks query={SEARCH_QUARKS} variables={variables} />
      </div>
    );
  }
}
export default Search;
