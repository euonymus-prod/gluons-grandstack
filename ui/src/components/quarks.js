// react
import React, { Component } from "react";
import PropTypes from "prop-types";

// component
import QuarkInList from "./quark-in-list";

class Quarks extends Component {
  render() {
    const { quarks } = this.props;
    return (
      <div>
        {quarks.map(quark => {
          return <QuarkInList key={quark.id} data={quark} />;
        })}
      </div>
    );
  }
}
Quarks.propTypes = {
  quarks: PropTypes.object.isRequired
};
export default Quarks;
