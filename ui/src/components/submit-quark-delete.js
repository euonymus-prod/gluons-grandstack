import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { Mutation } from "react-apollo";
import { QUARK_DELETE_MUTATION } from "../queries/mutation-quark-delete";
// Material UI
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

// TODO
const QUARKS_QUERY = "";

class SubmitQuarkDelete extends Component {
  updateAfterMutation = (store, { data: { CreateQuark } }) => {
    // Note: you need try catch, so error doesn't happen even if QUARKS_QUERY is not yet provided.
    try {
      const data = store.readQuery({
        query: QUARKS_QUERY,
        variables: {}
      });
      data.quarks.unshift(CreateQuark);
      store.writeQuery({
        query: QUARKS_QUERY,
        data,
        variables: {}
      });
    } catch (e) {} // eslint-disable-line
  };

  renderMenuItem = (title, iconComponent, postMutation, name, label) => {
    return (
      <MenuItem
        onClick={() => {
          this.onClick(postMutation, name);
        }}
      >
        <IconButton aria-label={label} color="inherit">
          <Badge badgeContent={0} color="secondary">
            {iconComponent}
          </Badge>
        </IconButton>
        <p>{title}</p>
      </MenuItem>
    );
  };
  renderIconItem = (title, iconComponent, postMutation, name, label) => {
    return (
      <IconButton
        aria-label={label}
        onClick={() => {
          this.onClick(postMutation, name);
        }}
      >
        <Badge badgeContent={0} color="secondary">
          {iconComponent}
        </Badge>
      </IconButton>
    );
  };

  onClick = (postMutation, name) => {
    let ret = window.confirm(`Are you sure you want to delete ${name}?`);
    if (ret !== true) {
      return false;
    }
    postMutation();
  };
  render() {
    const { name, variables } = this.props;
    const mutation = QUARK_DELETE_MUTATION;
    const func = this.props.withMenu
      ? this.renderMenuItem
      : this.renderIconItem;

    return (
      <Mutation
        mutation={mutation}
        variables={variables}
        onCompleted={data => {
          this.props.history.push(`/list`);
        }}
        onError={error => {
          alert(error.message);
        }}
        update={this.updateAfterMutation}
      >
        {postMutation => {
          return func(
            "Delete Quark",
            <DeleteForeverIcon />,
            postMutation,
            name
          );
        }}
      </Mutation>
    );
  }
}
SubmitQuarkDelete.propTypes = {
  variables: PropTypes.object.isRequired,
  withMenu: PropTypes.bool.isRequired
};
SubmitQuarkDelete.defaultProps = {
  withMenu: false
};
export default withRouter(withLastLocation(SubmitQuarkDelete));
