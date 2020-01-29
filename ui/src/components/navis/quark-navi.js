import React from "react";
import PropTypes from "prop-types";
// redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withAuthUser } from "../../providers/session";
import { withFirebase } from "../../providers/firebase";
import * as ROUTES from "../../constants/routes";
import SubmitQuarkDelete from "../submit-quark-delete";
// import { convertTableForTemporallyUse } from "../../utils/auth-util";
// Material UI
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";
// import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ViewListIcon from "@material-ui/icons/ViewList";
import AccountCircle from "@material-ui/icons/AccountCircle";

const QuarkNavi = props => {
  const { authUser } = props;

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

  const renderMenuItem = (title, iconComponent, onClick, label) => {
    return (
      <MenuItem onClick={onClick}>
        <IconButton aria-label={label} color="inherit">
          <Badge badgeContent={0} color="secondary">
            {iconComponent}
          </Badge>
        </IconButton>
        <p>{title}</p>
      </MenuItem>
    );
  };
  const renderIconItem = (title, iconComponent, onClick, label) => {
    return (
      <IconButton aria-label={label} onClick={onClick}>
        <Badge badgeContent={0} color="secondary">
          {iconComponent}
        </Badge>
      </IconButton>
    );
  };

  const showEditQuark = () => {
    if (!props.current_quark) {
      return false;
    }
    return props.location.pathname.startsWith(ROUTES.GRAPH_BASE);
  };

  const renderItems = func => {
    const user_id = authUser ? authUser.uid : null;
    if (!authUser) {
      // NOTE: Fragment is not allowed by Menu component
      return (
        <div>
          {func("List", <ViewListIcon />, onListClick)}
          {func("Profile", <AccountCircle />, props.handleProfileMenuOpen)}
        </div>
      );
    }

    return (
      <div>
        {func("Add New Quark", <AddCircleOutlineIcon />, onAddQuarkClick)}
        {showEditQuark() && func("Edit Quark", <EditIcon />, onEditQuarkClick)}
        {showEditQuark() && (
          <SubmitQuarkDelete
            name={"hoge"}
            variables={{ id: props.current_quark.id, user_id }}
            withMenu={props.withMenu}
          />
        )}

        {func("List", <ViewListIcon />, onListClick)}
        {func("Profile", <AccountCircle />, props.handleProfileMenuOpen)}
      </div>
    );
  };

  if (props.withMenu) {
    return (
      <Menu
        anchorEl={props.anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id="primary-search-account-menu-quark"
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(props.anchorEl)}
        onClose={handleMenuClose}
      >
        {renderItems(renderMenuItem)}
      </Menu>
    );
  } else {
    return renderItems(renderIconItem);
  }
};

QuarkNavi.propTypes = {
  anchorEl: PropTypes.object,
  handleMenuClose: PropTypes.func.isRequired,
  handleProfileMenuOpen: PropTypes.func.isRequired,
  withMenu: PropTypes.bool.isRequired
};
QuarkNavi.defaultProps = {
  withMenu: false
};
export default connect(state => state)(
  withRouter(withAuthUser(withFirebase(QuarkNavi)))
);
