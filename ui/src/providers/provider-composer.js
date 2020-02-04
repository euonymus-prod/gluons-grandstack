import React, { Component } from "react";
// Redux
import { Provider } from "react-redux";
import store from "./store";
// intls activities
import { IntlProvider } from "react-intl";
// apollo
// import ApolloClient from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
// Firebase
import { withFirebaseProvider } from "./firebase";
// Utils
import Util from "../utils/common";
// constancts
import * as LOCALSTORAGE from "../constants/localstorage";

const util = new Util(false);
const [locale, locale_messages] = util.localeInitializer();

// const client = new ApolloClient({
//   uri: process.env.REACT_APP_GRAPHQL_URI
// });

// create an Apollo Link to connect to our GraphQL API
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI
});

// create an Apollo Link to add our auth token to each request
const authLink = setContext((_, { headers }) => {
  const authUser = JSON.parse(localStorage.getItem(LOCALSTORAGE.AUTH_USER));
  return {
    headers: {
      ...headers,
      authorization: authUser ? `Bearer ${authUser["idToken"]}` : ""
    }
  };
});

const client = new ApolloClient({
  // chain our Apollo Links together
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

class ProviderComposer extends Component {
  render() {
    return (
      <Provider store={store}>
        <IntlProvider locale={locale} messages={locale_messages}>
          <ApolloProvider client={client}>{this.props.children}</ApolloProvider>
        </IntlProvider>
      </Provider>
    );
  }
}
export default withFirebaseProvider(ProviderComposer);
