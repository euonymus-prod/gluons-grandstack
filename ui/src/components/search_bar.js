// react
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
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
    maxWidth: 500,
    width: "100%"
  },
  button: {
    marginTop: theme.spacing(2)
  }
});

class SearchBar extends Component {
  state = {
    value: ""
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.history.push(`/subjects/search/${this.state.value}`);
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
        onSubmit={this.handleSubmit}
      >
        <div>
          <TextField
            id="outlined-basic"
            className={classes.textField}
            label="Type people, organization, product and so on"
            variant="outlined"
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
