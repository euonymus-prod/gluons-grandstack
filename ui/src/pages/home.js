// react
import React, { Component } from "react";
import PropTypes from "prop-types";
import logo from "../assets/images/logo.gif";
import { injectIntl, FormattedMessage } from "react-intl";

// component
import SearchBar from "../components/search-bar";
import TopPickups from "../components/top-pickups";

class Home extends Component {
  componentDidMount() {
    document.title = this.props.intl.formatMessage({
      id: "title_home",
      defaultMessage:
        "Search hidden relations on your favorite things, people, company... -\ngluons"
    });
    // document.title =
    //   "Search hidden relations on your favorite things, people, company... -\ngluons";
  }

  render() {
    return (
      <div>
        <div className="logo-top">
          <img src={logo} alt="gluons" />
        </div>

        <div className="home">
          <p className="text-center">
            <FormattedMessage
              id="message_home_main"
              defaultMessage={`Search hidden relations on your favorite things, people, company...`}
            />
          </p>

          <SearchBar type="home" />
          <TopPickups />
        </div>
      </div>
    );
  }
}
Home.propTypes = {
  intl: PropTypes.object.isRequired
};
export default injectIntl(Home);
