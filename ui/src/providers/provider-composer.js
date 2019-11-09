import React, { Component } from "react";
// Redux
// import { Provider } from 'react-redux'
// import store from './store'
// apollo
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

// Firebase
import { withFirebaseProvider } from "./firebase";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI
});

class ProviderComposer extends Component {
  render() {
    return (
      <ApolloProvider client={client}>{this.props.children}</ApolloProvider>
    );
  }
}
export default withFirebaseProvider(ProviderComposer);
//export default ProviderComposer

// <Provider store={store}>
//   {this.props.children}
// </Provider>
