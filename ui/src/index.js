import React from "react";
import ReactDOM from "react-dom";
import "./assets/styles/index.css";
import ProviderComposer from "./providers/provider-composer";
import App from "./pages/App";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <ProviderComposer>
    <App />
  </ProviderComposer>,
  document.getElementById("root")
);
serviceWorker.unregister();
