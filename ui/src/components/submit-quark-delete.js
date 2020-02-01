import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { Mutation } from "react-apollo";
import { QUARK_DELETE_MUTATION } from "../queries/mutation-quark-delete";
import GraphOnQuark from "../queries/query-graph-on-quark";
import QuarkList from "../queries/query-quark-list";
// Material UI
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

// TODO
const QUARKS_PER_PAGE = 100;
class SubmitQuarkDelete extends Component {
  updateAfterMutation = (store, { data: mutated }) => {
    const queryClasses = [GraphOnQuark, QuarkList];
    queryClasses.forEach((queryClass, index) => {
      const [queryName, query] = new queryClass(this.props);
      const variables = {};
      let isList = true;
      if (index === 0) {
        variables.name = this.props.name;
        isList = false;
      } else {
        variables.first = QUARKS_PER_PAGE;
        isList = true;
      }
      this.updateCache(store, queryName, query, variables, isList);
    });
  };
  updateCache = (store, queryName, query, variables, isList) => {
    try {
      // TODO: store.readQuery がなぜか失敗する。
      const data = store.readQuery({
        query,
        variables
      });
      if (isList) {
        data[queryName] = _.reject(data[queryName], ["name", this.props.name]);
      } else {
        data[queryName] = null;
      }
      store.writeQuery({
        query,
        data,
        variables
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
  name: PropTypes.string.isRequired,
  variables: PropTypes.object.isRequired,
  withMenu: PropTypes.bool.isRequired
};
SubmitQuarkDelete.defaultProps = {
  withMenu: false
};
export default withRouter(withLastLocation(SubmitQuarkDelete));
