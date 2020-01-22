import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withAuthUser } from "../../providers/session";
import { withFirebase } from "../../providers/firebase";
import * as ROUTES from "../../constants/routes";
// Material UI
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const UserNavi = props => {
  const handleMenuClose = () => {
    props.handleMenuClose();
  };

  const onLogin = () => {
    props.history.push(ROUTES.LOGIN);
    handleMenuClose();
  };

  const onLogout = () => {
    props.firebase.doSignOut();
    handleMenuClose();
  };

  const onSignup = () => {
    props.history.push(ROUTES.SIGN_UP);
    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const isMenuOpen = Boolean(props.anchorEl);

  return (
    <Menu
      anchorEl={props.anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {props.authUser ? (
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      ) : (
        [
          <MenuItem key="1" onClick={onLogin}>
            Login
          </MenuItem>,
          <MenuItem key="2" onClick={onSignup}>
            Signup
          </MenuItem>
        ]
      )}
    </Menu>
  );
};
UserNavi.propTypes = {
  anchorEl: PropTypes.object,
  handleMenuClose: PropTypes.func.isRequired
};
export default withRouter(withAuthUser(withFirebase(UserNavi)));
