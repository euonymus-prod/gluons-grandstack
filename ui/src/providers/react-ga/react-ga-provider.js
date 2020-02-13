import React from "react";
import ReactGa from "react-ga";
import ReactGaContext from "./context";

class googleAnalytics {
  constructor(ReactGa) {
    this.ReactGa = ReactGa;
    this.ReactGa.initialize("UA-15649807-18");
  }

  trackPage = page => {
    this.ReactGa.set({
      page
      // ...options,
    });
    this.ReactGa.pageview(page);
  };
}
const GA = new googleAnalytics(ReactGa);

const withReactGaProvider = Component => {
  class WithReactGaProvider extends React.Component {
    constructor(props) {
      super(props);
      ReactGa.initialize("UA-15649807-18");
    }

    render() {
      return (
        <ReactGaContext.Provider value={GA}>
          <Component {...this.props} />
        </ReactGaContext.Provider>
      );
    }
  }
  return WithReactGaProvider;
};

export default withReactGaProvider;
