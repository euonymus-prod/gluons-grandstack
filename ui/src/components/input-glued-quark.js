import _ from "lodash";
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { withAuthUser } from "../providers/session";
// GraphQL
import QuarkListSearched from "../queries/query-quark-list-searched";
import { querySelector } from "../utils/auth-util";
// constancts
import * as QUERY_NAME from "../constants/query-names";
// Material UI
import { withStyles } from "@material-ui/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const ROWS_PER_PAGE = 20;
const styles = theme => ({
  menu: {
    paddingTop: "45px"
  }
});

class InputGluedQuark extends Component {
  state = {
    value: "",
    searchKeyword: "",
    anchorEl: null
  };

  onTabDown = event => {
    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault();
      this.setState({ searchKeyword: this.state.value });
      const anchorEl = event.currentTarget;
      this.setState({ anchorEl });
    } else {
      this.handleMenuClose();
      this.setState({ searchKeyword: "" });
    }
  };
  onChange = event => {
    const { dataset } = event.currentTarget;
    let value = event.target.value;
    let anchorEl = event.currentTarget;
    if (dataset.value) {
      anchorEl = null;
      value = dataset.value;
    }
    this.setState({ value, anchorEl });

    // this.setState(
    //   { value, anchorEl },
    //   () => {
    //     if (this.state.value && this.state.value.length > 1) {
    //       // if (this.state.value.length % 2 === 0) {
    //         this.debouncedGetInfo();
    //       // }
    //     }
    //   }
    // );
    this.props.onChange({ passive: value });
  };
  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  debouncedGetInfo = _.debounce(() => {
    this.setState({ searchKeyword: this.state.value });
  }, 300);

  render() {
    const { classes } = this.props;
    const { authUser } = this.props;
    const [queryName, user_id] = querySelector(
      authUser,
      QUERY_NAME.READER_SEARCH_QUARKS,
      QUERY_NAME.USER_SEARCH_QUARKS,
      QUERY_NAME.ADMIN_SEARCH_QUARKS
    );
    const variables = {
      first: ROWS_PER_PAGE,
      keyword: this.state.searchKeyword
    };

    const GRAPHQL_QUERY = new QuarkListSearched(queryName, user_id);
    const isMenuOpen = Boolean(this.state.anchorEl);
    return (
      <Fragment>
        <input
          value={this.state.value}
          name="value"
          onChange={this.onChange}
          onKeyDown={this.onTabDown}
          type="text"
          placeholder="Input Quark Name"
          className={`form-control`}
        />
        {variables.keyword && (
          <Query query={GRAPHQL_QUERY} variables={variables}>
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
              const quarks = data[queryName];
              if (quarks.length === 0) {
                return null;
              }
              return (
                <Menu
                  anchorEl={this.state.anchorEl}
                  open={isMenuOpen}
                  onClose={this.handleMenuClose}
                  className={classes.menu}
                >
                  {quarks.map(quark => {
                    return (
                      <MenuItem
                        key={quark.id}
                        dense={true}
                        onClick={this.onChange}
                        data-value={quark.name}
                      >
                        {quark.name}
                      </MenuItem>
                    );
                  })}
                </Menu>
              );
            }}
          </Query>
        )}
      </Fragment>
    );
  }
}
InputGluedQuark.propTypes = {
  onChange: PropTypes.func.isRequired
};
export default withStyles(styles)(withAuthUser(InputGluedQuark));
