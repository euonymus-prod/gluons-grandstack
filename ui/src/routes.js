// react
import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { withAuthentication } from "./providers/session";
import ScrollToTop from "./components/scroll-to-top";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import AuthRoutes from "./auth-routes";
// pages
import Home from "./pages/home";
import Graph from "./pages/graph";
import Search from "./pages/search";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
// constants
import * as ROUTES from "./constants/routes";
// material ui
import Container from "@material-ui/core/Container";
import { CssBaseline } from "@material-ui/core";

class AppRoutes extends Component {
  render() {
    return (
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Container maxWidth="lg">
          <CssBaseline />
          <div className="main-content">
            <Switch>
              <Route path={ROUTES.HOME} exact component={Home} />
              <Route path={ROUTES.TERMS} component={Terms} />
              <Route path={ROUTES.PRIVACY} component={Privacy} />

              <Route path={ROUTES.GRAPH} component={Graph} />
              <Route path={ROUTES.SEARCH} component={Search} />
              <Route
                path={ROUTES.LEGACY_GRAPH}
                render={props => (
                  <Redirect
                    to={`${ROUTES.GRAPH_BASE}${props.match.params.quark_name}`}
                  />
                )}
              />
              <Route
                path={ROUTES.LEGACY_SEARCH}
                render={props => (
                  <Redirect
                    to={`${ROUTES.SEARCH_BASE}${props.match.params.query}`}
                  />
                )}
              />
              <Route path="/" component={AuthRoutes} />
            </Switch>
          </div>
        </Container>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default withAuthentication(AppRoutes);
