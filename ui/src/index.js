import React from "react";
import ReactDOM from "react-dom";
import ProviderComposer from "./providers/provider-composer";
import AppRoutes from "./routes";
import "./assets/styles/index.css";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <ProviderComposer>
    <AppRoutes />
  </ProviderComposer>,
  document.getElementById("root")
);
serviceWorker.unregister();
