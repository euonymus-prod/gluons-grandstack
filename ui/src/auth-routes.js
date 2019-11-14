// react
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withAuthentication } from "./providers/session";
import * as ROUTES from "./constants/routes";
// pages
import Signup from "./pages/signup";
import Login from "./pages/login";
import NotAuthorized from "./pages/not-authorized";
import PasswordForget from "./pages/password-forget";
import LoggedIn from "./pages/logged-in";
import EmailVerified from "./pages/email-verified";
import NotFound from "./pages/not-found";

class ConsoleRoutes extends Component {
  render() {
    return (
      <Switch>
        <Route path={ROUTES.SIGN_UP} component={Signup} />
        <Route path={ROUTES.LOGIN} component={Login} />
        <Route path={ROUTES.NOT_AUTHORIZED} component={NotAuthorized} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
        <Route path={ROUTES.LOGGED_IN} component={LoggedIn} />
        <Route path={ROUTES.EMAIL_VERIFIED} component={EmailVerified} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default withAuthentication(ConsoleRoutes);
