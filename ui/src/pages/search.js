// react
import React, { Component } from "react";
// GraphQL
import gql from "graphql-tag";

// component
import Quarks from "../components/quarks";

const rowsPerPage = 100;
const SEARCH_QUARKS = gql`
  query searchQuarks($first: Int, $keyword: String) {
    searchQuarks(first: $first, keyword: $keyword) {
      id
      name
      description
      image_path
    }
  }
`;

class Search extends Component {
  componentDidMount() {
    document.title = `Search Result of ${this.props.match.query} -\ngluons`;
  }

  render() {
    const { query } = this.props.match.params;
    const variables = {
      first: rowsPerPage,
      keyword: query
    };
    const quark_property_caption = query;
    return (
      <div className="container">
        <h2>{quark_property_caption}</h2>
        <Quarks query={SEARCH_QUARKS} variables={variables} />
      </div>
    );
  }
}
export default Search;
