import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { Mutation } from "react-apollo";
import { GLUON_DELETE_MUTATION } from "../queries/mutation-gluon-delete";
// Material UI
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

// TODO
// const QUARKS_QUERY = "";

class SubmitGluonDelete extends Component {
  updateAfterMutation = (store, { data: { CreateQuark } }) => {
    // Note: you need try catch, so error doesn't happen even if QUARKS_QUERY is not yet provided.
    // try {
    //   const data = store.readQuery({
    //     query: QUARKS_QUERY,
    //     variables: {}
    //   });
    //   data.quarks.unshift(CreateQuark);
    //   store.writeQuery({
    //     query: QUARKS_QUERY,
    //     data,
    //     variables: {}
    //   });
    // } catch (e) {} // eslint-disable-line
  };

  onClick = postMutation => {
    let ret = window.confirm(`Are you sure you want to delete the relation?`);
    if (ret !== true) {
      return false;
    }
    postMutation();
  };

  renderIconItem = (iconComponent, postMutation) => {
    return (
      <IconButton
        onClick={() => {
          this.onClick(postMutation);
        }}
      >
        <Badge badgeContent={0} color="secondary">
          {iconComponent}
        </Badge>
      </IconButton>
    );
  };

  render() {
    const { variables } = this.props;
    const mutation = GLUON_DELETE_MUTATION;

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
          return this.renderIconItem(<DeleteForeverIcon />, postMutation);
        }}
      </Mutation>
    );
  }
}
SubmitGluonDelete.propTypes = {
  variables: PropTypes.object.isRequired
};
export default withRouter(withLastLocation(SubmitGluonDelete));
