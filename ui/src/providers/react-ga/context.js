import React from "react";

const ReactGaContext = React.createContext(null);

export const withReactGa = Component => props => (
  <ReactGaContext.Consumer>
    {GA => <Component {...props} GA={GA} />}
  </ReactGaContext.Consumer>
);

export default ReactGaContext;
