import React, { useState } from "react";
import { withReactGa } from "../../providers/react-ga";
// redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withAuthUser } from "../../providers/session";
import { withFirebase } from "../../providers/firebase";
import * as ROUTES from "../../constants/routes";
import UserNavi from "./user-navi";
import QuarkNavi from "./quark-navi";
// Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import logo from "../../assets/images/logo.gif";
// Styles
import { useStyles } from "../../assets/styles/navbar";

export default connect(state => state)(
  withRouter(
    withReactGa(
      withAuthUser(
        withFirebase(props => {
          const [prevLocation, setPrevLocation] = useState(null);
          if (props.location.pathname !== prevLocation) {
            props.GA.trackPage(props.location.pathname);
            setPrevLocation(props.location.pathname);
          }

          const classes = useStyles();
          const [anchorEl, setAnchorEl] = React.useState(null);
          const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(
            null
          );
          const [searchQuery, setSearchQuery] = React.useState("");

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

          const onSubmit = event => {
            event.preventDefault();
            props.history.push(`${ROUTES.SEARCH_BASE}${searchQuery}`);
          };

          const onInputChange = value => {
            setSearchQuery(value);
          };

          return (
            <div className={classes.grow}>
              <AppBar position="static" className={classes.appBar}>
                <Toolbar>
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
                    <QuarkNavi
                      anchorEl={mobileMoreAnchorEl}
                      handleMenuClose={handleMenuClose}
                      handleProfileMenuOpen={handleProfileMenuOpen}
                    />
                  </div>
                  <div className={classes.sectionMobile}>
                    <IconButton
                      aria-label="show more"
                      aria-controls="primary-search-account-menu-mobile"
                      aria-haspopup="true"
                      onClick={handleMobileMenuOpen}
                    >
                      <MoreIcon />
                    </IconButton>
                  </div>
                </Toolbar>
              </AppBar>
              <QuarkNavi
                anchorEl={mobileMoreAnchorEl}
                handleMenuClose={handleMenuClose}
                handleProfileMenuOpen={handleProfileMenuOpen}
                withMenu={true}
              />
              <UserNavi anchorEl={anchorEl} handleMenuClose={handleMenuClose} />
            </div>
          );
        })
      )
    )
  )
);
