// react
import React, { Component } from "react";
// GraphQL
import gql from "graphql-tag";

// component
import Quarks from "../components/quarks";

const rowsPerPage = 100;
const SEARCH_QUARKS = gql`
  query quarks($first: Int) {
    quarks(first: $first) {
      id
      name
      description
      image_path
      start {
        year
        month
        day
      }
      end {
        year
        month
        day
      }
      start_accuracy
      end_accuracy
      is_momentary
    }
  }
`;

class Search extends Component {
  componentDidMount() {
    document.title = `Quark list -\ngluons`;
  }

  render() {
    const variables = {
      first: rowsPerPage
    };
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
