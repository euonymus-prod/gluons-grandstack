import React from "react";
// import ReactGa from "react-ga";
import ReactGa from "react-ga4";
import ReactGaContext from "./context";

class googleAnalytics {
  constructor(ReactGa) {
    this.ReactGa = ReactGa;
    this.ReactGa.initialize("G-B4NJ964F8J");
  }
  // trackPage = page => {
  //   this.ReactGa.set({
  //     page
  //     // ...options,
  //   });
  //   this.ReactGa.pageview(page);
  // };
  trackPage = page => {
    this.ReactGa.send({
      hitType: "pageview",
      page
    });
  };
}
const GA = new googleAnalytics(ReactGa);

const withReactGaProvider = Component => {
  class WithReactGaProvider extends React.Component {
    constructor(props) {
      super(props);
      ReactGa.initialize("G-B4NJ964F8J");
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
