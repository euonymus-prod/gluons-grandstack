// react
import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { withAuthentication } from "./providers/session";
import * as ROUTES from "./constants/routes";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
// pages
import App from "./pages/App";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
// import Home           from './pages/home';
// // import Vote           from './pages/vote-tilt';
// // import Vote           from './pages/vote-card.jsx';
// import Vote           from './templates/ncc_sf2019/vote-card';
// import Screen         from './templates/ncc_sf2019/screen';
import AuthRoutes from "./auth-routes";

import { CssBaseline } from "@material-ui/core";

class AppRoutes extends Component {
  render() {
    return (
      <BrowserRouter>
        <CssBaseline />
        <Navbar />
        <div className="main-content">
          <Switch>
            <Route path={ROUTES.HOME} exact component={App} />
            <Route path={ROUTES.TERMS} exact component={Terms} />
            <Route path={ROUTES.PRIVACY} exact component={Privacy} />
            {/*
                <Route path={ROUTES.HOME} exact component={Home}/>
                <Route path={ROUTES.VOTE} component={Vote}/>
                <Route path={ROUTES.SCREEN} component={Screen}/>
              */}
            <Route path="/" component={AuthRoutes} />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default withAuthentication(AppRoutes);
