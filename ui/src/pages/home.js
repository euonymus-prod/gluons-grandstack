// react
import React, { Component } from "react";
import logo from "../assets/images/logo.gif";

// component
import SearchBar from "../components/search-bar";
import TopPickups from "../components/top_pickups";

class Home extends Component {
  componentDidMount() {
    document.title =
      "Search hidden relations on your favorite things, people, company... -\ngluons";
  }

  render() {
    return (
      <div className="container">
        <div className="logo-top">
          <img src={logo} alt="gluons" />
        </div>

        <div className="home">
          <p className="text-center">
            Search hidden relations on your favorite things, people, company...
          </p>

          <SearchBar type="home" />
          <TopPickups />
        </div>
      </div>
    );
  }
}
export default Home;
