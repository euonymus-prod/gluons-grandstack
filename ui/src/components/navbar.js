import React from "react";
import { withRouter, Link } from "react-router-dom";
import { withAuthUser } from "../providers/session";
import { withFirebase } from "../providers/firebase";
import * as ROUTES from "../constants/routes";
// Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
// import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
// import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
// import MailIcon from "@material-ui/icons/Mail";
import ViewListIcon from "@material-ui/icons/ViewList";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
// import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import logo from "../assets/images/logo.gif";
// Styles
import { useStyles } from "../assets/styles/navbar";

export default withRouter(
  withAuthUser(
    withFirebase(props => {
      const classes = useStyles();
      const [anchorEl, setAnchorEl] = React.useState(null);
      const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
      const [searchQuery, setSearchQuery] = React.useState("");

      const isMenuOpen = Boolean(anchorEl);
      const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

      const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
      };

      const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
      };

      const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
      };

      const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
      };

      const onLogin = () => {
        handleMenuClose();
        props.history.push(ROUTES.LOGIN);
      };

      const onLogout = () => {
        handleMenuClose();
        props.firebase.doSignOut();
      };

      const onSignup = () => {
        handleMenuClose();
        props.history.push(ROUTES.SIGN_UP);
      };

      const onAddQuarkClick = () => {
        handleMenuClose();
        props.history.push(ROUTES.ADD_QUARK);
      };
      const onListClick = () => {
        handleMenuClose();
        props.history.push(ROUTES.LIST);
      };

      const onSubmit = event => {
        event.preventDefault();
        props.history.push(`${ROUTES.SEARCH_BASE}${searchQuery}`);
      };

      const onInputChange = value => {
        setSearchQuery(value);
      };

      const menuId = "primary-search-account-menu";
      const renderMenu = (
        <Menu
          anchorEl={anchorEl}
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

      const mobileMenuId = "primary-search-account-menu-mobile";
      const renderMobileMenu = (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          <MenuItem onClick={onListClick}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <ViewListIcon />
              </Badge>
            </IconButton>
            <p>List</p>
          </MenuItem>
          {/*
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
*/}
          <MenuItem onClick={handleProfileMenuOpen}>
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

      return (
        <div className={classes.grow}>
          <AppBar position="static" className={classes.appBar}>
            <Toolbar>
              {/*
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
*/}
              <Toolbar>
                <Link to={ROUTES.HOME}>
                  <img src={logo} className={classes.logo} alt="gluons" />
                </Link>
              </Toolbar>
              <div className={classes.search}>
                <form onSubmit={onSubmit}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    inputProps={{ "aria-label": "search" }}
                    value={searchQuery}
                    onChange={event => onInputChange(event.target.value)}
                  />
                </form>
              </div>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton
                  aria-label="show 4 new mails"
                  onClick={onAddQuarkClick}
                >
                  <Badge badgeContent={0} color="secondary">
                    <AddCircleOutlineIcon />
                  </Badge>
                </IconButton>
                <IconButton aria-label="show 4 new mails" onClick={onListClick}>
                  <Badge badgeContent={0} color="secondary">
                    <ViewListIcon />
                  </Badge>
                </IconButton>
                {/*
            <IconButton aria-label="show 17 new notifications">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
*/}
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                >
                  <AccountCircle />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
        </div>
      );
    })
  )
);
