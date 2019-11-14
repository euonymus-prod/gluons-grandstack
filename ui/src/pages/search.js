// react
import React, { Component } from "react";
// component
import QuarkInList from "../components/quark-in-list";

class Search extends Component {
  componentDidMount() {
    document.title = `Search Result of ${this.props.match.params.keywords} -\ngluons`;
  }

  render() {
    const quark_property_caption = "test caption";
    return (
      <div className="container">
        <h2>{quark_property_caption}</h2>
        <div className="related">
          <div className="well subject-relation white">
            <QuarkInList />
          </div>
        </div>
      </div>
    );
  }
}
export default Search;
