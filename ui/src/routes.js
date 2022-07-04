// react
import React, { Component } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { LastLocationProvider } from "react-router-last-location";
import { withAuthentication } from "./providers/session";
import ScrollToTop from "./components/scroll-to-top";
import Navbar from "./components/navis/navbar";
import Footer from "./components/footer";
import AuthRoutes from "./auth-routes";
// pages
import Home from "./pages/home";
import Graph from "./pages/graph";
import List from "./pages/list";
import Search from "./pages/search";
import AddQuark from "./pages/add-quark";
import EditQuark from "./pages/edit-quark";
import AddGluon from "./pages/add-gluon";
import EditGluon from "./pages/edit-gluon";
import Contact from "./pages/contact";
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
      <HashRouter>
        <LastLocationProvider>
          <ScrollToTop />
          <Navbar />
          <Container maxWidth="lg" disableGutters={true}>
            <CssBaseline />
            <div className="main-content">
              <Switch>
                <Route path={ROUTES.HOME} exact component={Home} />
                <Route path={ROUTES.CONTACT} component={Contact} />
                <Route path={ROUTES.TERMS} component={Terms} />
                <Route path={ROUTES.PRIVACY} component={Privacy} />

                <Route path={ROUTES.GRAPH} component={Graph} />
                <Route path={ROUTES.LIST} component={List} />
                <Route path={ROUTES.SEARCH} component={Search} />
                <Route path={ROUTES.ADD_QUARK} component={AddQuark} />
                <Route path={ROUTES.ADD_GLUON} component={AddGluon} />
                <Route path={ROUTES.EDIT_QUARK} component={EditQuark} />
                <Route path={ROUTES.EDIT_GLUON} component={EditGluon} />
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
      </HashRouter>
    );
  }
}

export default withAuthentication(AppRoutes);
