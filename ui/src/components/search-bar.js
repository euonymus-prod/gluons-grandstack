// react
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../constants/routes";

import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  container: {
    // display: 'flex',
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      maxWidth: 500
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: 350
    }
  },
  button: {
    marginTop: theme.spacing(2)
  }
});

class SearchBar extends Component {
  state = {
    value: ""
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.history.push(`${ROUTES.SEARCH_BASE}${this.state.value}`);
  };

  onInputChange(value) {
    this.setState({ value });
  }

  render() {
    const { classes } = this.props;
    return (
      <form
        className={classes.container}
        noValidate
        autoComplete="off"
        onSubmit={this.onSubmit}
      >
        <div>
          <TextField
            id="outlined-basic"
            className={classes.textField}
            label="Type people, organization, product and so on"
            variant="outlined"
            value={this.state.value}
            onChange={event => this.onInputChange(event.target.value)}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
        >
          Gluons Search
        </Button>
      </form>
    );
  }
}
export default withRouter(withStyles(styles)(SearchBar));
