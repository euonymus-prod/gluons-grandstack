import React from "react";
import ReactDOM from "react-dom";
import "./assets/styles/index.css";
import App from "./pages/App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
