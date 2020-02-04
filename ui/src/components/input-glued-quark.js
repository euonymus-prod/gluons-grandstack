import _ from "lodash";
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { withAuthUser } from "../providers/session";
// GraphQL
import QuarkListSearched from "../queries/query-quark-list-searched";
import Util from "../utils/common";
// Material UI
import { withStyles } from "@material-ui/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

const util = new Util(false);

const ROWS_PER_PAGE = 20;
const styles = theme => ({
  menu: {
    paddingTop: "45px"
  },
  menuItem: {
    minWidth: "180px"
  },
  input: {
    backgroundColor: "#fee"
  }
});

class InputGluedQuark extends Component {
  state = {
    value: "",
    searchKeyword: "",
    anchorEl: null
  };

  onTabDown = event => {
    // if (event.key === "Tab" || event.key === "Enter") {
    if (event.key === "Enter") {
      event.preventDefault();
      this.setState({ searchKeyword: this.state.value });
      const anchorEl = event.currentTarget;
      this.setState({ anchorEl });
    } else {
      this.handleMenuClose();
      this.setState({ searchKeyword: "" });
    }
  };
  onClick = event => {
    this.onChange(event);
  };
  onChange = event => {
    const { dataset } = event.currentTarget;
    let value = event.target.value;
    let anchorEl = event.currentTarget;
    let passive_id = null;
    if (dataset.passive_id) {
      anchorEl = null;
      value = dataset.passive;
      passive_id = dataset.passive_id;
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

    this.props.onChange({ passive: value, passive_id });
  };
  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  debouncedGetInfo = _.debounce(() => {
    this.setState({ searchKeyword: this.state.value });
  }, 300);

  render() {
    const { classes } = this.props;

    const [queryName, GRAPHQL_QUERY] = new QuarkListSearched(this.props);
    const variables = {
      first: ROWS_PER_PAGE,
      keyword: this.state.searchKeyword
    };
    const isMenuOpen = Boolean(this.state.anchorEl);
    return (
      <Fragment>
        <TextField
          className={classes.input}
          onChange={this.onChange}
          onKeyDown={this.onTabDown}
          margin="normal"
          variant="outlined"
          value={this.state.value}
          name="value"
          label="Quark you glue"
          placeholder={`Type Quark name to connect`}
          type="text"
          required
          color="secondary"
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
                        onClick={this.onClick}
                        data-passive_id={quark.id}
                        data-passive={util.localedProp(quark, "name")}
                        className={classes.menuItem}
                      >
                        {util.localedProp(quark, "name")}
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
