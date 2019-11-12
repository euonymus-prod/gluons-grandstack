// react
import React, { Component } from "react";
// component

class Search extends Component {
  componentDidMount() {
    document.title = `Search Result of ${this.props.match.params.keywords} -\ngluons`;
  }

  render() {
    return <div className="container">hoge</div>;
  }
}
export default Search;
