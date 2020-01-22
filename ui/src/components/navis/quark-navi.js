import React from "react";
import PropTypes from "prop-types";
// redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withAuthUser } from "../../providers/session";
import { withFirebase } from "../../providers/firebase";
import * as ROUTES from "../../constants/routes";
// Material UI
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";
import ViewListIcon from "@material-ui/icons/ViewList";
import AccountCircle from "@material-ui/icons/AccountCircle";

const QuarkNavi = props => {
  const handleMenuClose = () => {
    props.handleMenuClose();
  };

  const onAddQuarkClick = () => {
    props.history.push(ROUTES.ADD_QUARK);
    handleMenuClose();
  };

  const onEditQuarkClick = () => {
    const quark_id = props.current_quark.id;
    props.history.push(`${ROUTES.EDIT_QUARK_BASE}${quark_id}`);
    handleMenuClose();
  };

  const onListClick = () => {
    props.history.push(ROUTES.LIST);
    handleMenuClose();
  };

  const menuId = "primary-search-account-menu-quark";
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
      <MenuItem onClick={onAddQuarkClick}>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <AddCircleOutlineIcon />
          </Badge>
        </IconButton>
        <p>Add New Quark</p>
      </MenuItem>

      {props.current_quark && (
        <MenuItem onClick={onEditQuarkClick}>
          <IconButton aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={0} color="secondary">
              <EditIcon />
            </Badge>
          </IconButton>
          <p>Edit Quark</p>
        </MenuItem>
      )}

      <MenuItem onClick={onListClick}>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <ViewListIcon />
          </Badge>
        </IconButton>
        <p>List</p>
      </MenuItem>

      <MenuItem onClick={props.handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
};
QuarkNavi.propTypes = {
  anchorEl: PropTypes.object,
  handleMenuClose: PropTypes.func.isRequired,
  handleProfileMenuOpen: PropTypes.func.isRequired
};
export default connect(state => state)(
  withRouter(withAuthUser(withFirebase(QuarkNavi)))
);
