// react
import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { LastLocationProvider } from "react-router-last-location";
import { withAuthentication } from "./providers/session";
import ScrollToTop from "./components/scroll-to-top";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import AuthRoutes from "./auth-routes";
// pages
import Home from "./pages/home";
import Graph from "./pages/graph";
import List from "./pages/list";
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
        <LastLocationProvider>
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
                <Route path={ROUTES.LIST} component={List} />
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
                  path={ROUTES.LEGACY_LIST}
                  exact
                  render={props => <Redirect to={ROUTES.LIST} />}
                />
                <Route
                  path={ROUTES.LEGACY_SEARCH}
                  render={props => (
                    <Redirect
                      to={`${ROUTES.SEARCH_BASE}${props.match.params.keyword}`}
                    />
                  )}
                />
                <Route path="/" component={AuthRoutes} />
              </Switch>
            </div>
          </Container>
          <Footer />
        </LastLocationProvider>
      </BrowserRouter>
    );
  }
}

export default withAuthentication(AppRoutes);
