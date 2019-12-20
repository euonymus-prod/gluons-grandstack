// react
import React, { Component } from "react";
import { withAuthUser } from "../providers/session";
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
        <Quarks query={SEARCH_QUARKS} variables={variables} />
      </div>
    );
  }
}
export default withAuthUser(Search);
