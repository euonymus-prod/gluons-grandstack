// react
import { Component } from "react";
import { withAuthorization } from "../providers/session";
import { withRouter } from "react-router-dom";

class LoggedinOnly extends Component {
  render() {
    return this.props.children;
  }
}

const condition = authUser => {
  return !!authUser;
};
export default withAuthorization(condition)(withRouter(LoggedinOnly));
