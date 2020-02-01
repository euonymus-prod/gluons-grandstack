import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { Mutation } from "react-apollo";
import { withAuthUser } from "../providers/session";
import QuarkMutation from "../queries/mutation-quark";
import GraphOnQuark from "../queries/query-graph-on-quark";
import QuarkList from "../queries/query-quark-list";
// constancts
import * as QUERY_NAME from "../constants/query-names";
import * as ROUTES from "../constants/routes";

// Material UI
import Button from "@material-ui/core/Button";

const QUARKS_PER_PAGE = 100;
class SubmitQuark extends Component {
  updateAfterMutation = (store, { data: mutated }) => {
    const newData = mutated[QUERY_NAME.CREATE_QUARK]
      ? mutated[QUERY_NAME.CREATE_QUARK]
      : mutated[QUERY_NAME.UPDATE_QUARK];

    const queryClasses = [GraphOnQuark, QuarkList];
    queryClasses.forEach((queryClass, index) => {
      const [queryName, query] = new queryClass(this.props);
      const variables = {};
      let isList = true;
      if (index === 0) {
        variables.name = newData.name;
        isList = false;
      } else {
        variables.first = QUARKS_PER_PAGE;
        isList = true;
      }
      this.updateCache(store, queryName, query, variables, newData, isList);
    });
  };
  updateCache = (store, queryName, query, variables, newData, isList) => {
    try {
      const data = store.readQuery({
        query,
        variables
      });
      if (isList) {
        data[queryName] = _.reject(data[queryName], ["name", newData.name]);
        data[queryName].unshift(newData);
      } else {
        data[queryName] = { ...data[queryName], ...newData };
      }
      store.writeQuery({
        query,
        data,
        variables
      });
    } catch (e) {} // eslint-disable-line
  };

  render() {
    const { formVariables } = this.props;
    const variables = {
      ...formVariables,
      start: { formatted: formVariables.start },
      end: { formatted: formVariables.end },
      quark_type_id: Number(formVariables.quark_type_id)
    };

    let mutationName = QUERY_NAME.CREATE_QUARK;
    if (variables.id) {
      mutationName = QUERY_NAME.UPDATE_QUARK;
    }
    const mutation = new QuarkMutation(mutationName);
    return (
      <Mutation
        mutation={mutation}
        variables={variables}
        onCompleted={data => {
          this.props.history.push(
            `${ROUTES.GRAPH_BASE}${data[mutationName].name}`
          );
        }}
        onError={error => {
          alert(error.message);
        }}
        update={this.updateAfterMutation}
      >
        {postMutation => {
          return (
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                if (!formVariables.name) {
                  alert("Name is required");
                  return false;
                }
                postMutation();
              }}
            >
              Submit
            </Button>
          );
        }}
      </Mutation>
    );
  }
}
SubmitQuark.propTypes = {
  formVariables: PropTypes.object.isRequired
};
export default withRouter(withLastLocation(withAuthUser(SubmitQuark)));
