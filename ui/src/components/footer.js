import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import "../assets/styles/footer.css";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <div className="text-muted">
            &copy; 2016 gluons&nbsp;&nbsp;&nbsp;
            <Link to="/terms">Terms</Link>&nbsp;&nbsp;&nbsp;
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    );
  }
}
export default withRouter(Footer);
