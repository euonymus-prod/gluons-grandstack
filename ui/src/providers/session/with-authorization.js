import React from "react";
// import { withRouter, Link } from 'react-router-dom'
import { withRouter } from "react-router-dom";
import { withFirebase } from "../firebase";
import { withAuthUser } from "./context";
import * as ROUTES from "../../constants/routes";

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          // this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.NOT_AUTHORIZED);
          }
        },
        () => this.props.history.push(ROUTES.NOT_AUTHORIZED)
      );
    }
    componentWillUnmount() {
      this.listener();
    }

    // render() {
    //   if (!condition(this.props.authUser)) {
    //     return (
    //       <div>
    //         <Link to="/login">Login to the site</Link>
    //       </div>
    //     )
    //   }
    //   return (
    //     <Component {...this.props} />
    //   )
    // }
    render() {
      return condition(this.props.authUser) ? (
        <Component {...this.props} />
      ) : null;
    }
  }

  return withRouter(withFirebase(withAuthUser(WithAuthorization)));
};

export default withAuthorization;
