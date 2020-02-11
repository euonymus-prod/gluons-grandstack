import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { Mutation } from "react-apollo";
import GluonMutation from "../queries/mutation-gluon";
import * as QUERY_NAME from "../constants/query-names";
import * as ROUTES from "../constants/routes";
import Util from "../utils/common";
// Material UI
import Button from "@material-ui/core/Button";

// const QUARKS_PER_PAGE = 20;
// const QUARKS_QUERY = "";

const util = new Util(false);
class SubmitGluon extends Component {
  getMutationName = () => {
    return this.props.formVariables.id
      ? QUERY_NAME.UPDATE_GLUON
      : QUERY_NAME.CREATE_GLUON;
  };

  updateAfterMutation = (store, { data: mutated }) => {
    // const mutationName = this.getMutationName();
    // const newData = mutated[mutationName];
    // const first = QUARKS_PER_PAGE;
    // const skip = 0;
    // const orderBy = "created";
    //
    // // Note: you need try catch, so error doesn't happen even if QUARKS_QUERY is not yet provided.
    // try {
    //   const data = store.readQuery({
    //     query: QUARKS_QUERY,
    //     variables: { first, skip, orderBy }
    //   });
    //   data.quarks.unshift(CreateQuark);
    //   store.writeQuery({
    //     query: QUARKS_QUERY,
    //     data,
    //     variables: { first, skip, orderBy }
    //   });
    // } catch (e) {} // eslint-disable-line
  };

  render() {
    const { targetQuark, formVariables } = this.props;
    const avoid2Edit = ["relation", "prefix", "suffix"];
    const variables = {
      ..._.omit(formVariables, avoid2Edit),
      start: { formatted: formVariables.start },
      end: { formatted: formVariables.end },
      gluon_type_id: Number(formVariables.gluon_type_id)
    };
    if (util.isEnglish()) {
      variables.relation = formVariables.relation;
      variables.prefix = formVariables.prefix;
      variables.suffix = formVariables.suffix;
    } else {
      variables.relation_ja = formVariables.relation;
      variables.prefix_ja = formVariables.prefix;
      variables.suffix_ja = formVariables.suffix;
    }

    const mutationName = this.getMutationName();
    const mutation = new GluonMutation(mutationName);
    return (
      <Mutation
        mutation={mutation}
        variables={variables}
        onCompleted={data => {
          const name = util.localedProp(targetQuark, "name");
          this.props.history.push(`${ROUTES.GRAPH_BASE}${name}`);
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
                if (variables.gluon_type_id === 0) {
                  alert("Please choose Gluon Type");
                  return false;
                }
                if (
                  !formVariables.id &&
                  !formVariables.passive_id &&
                  !formVariables.passive
                ) {
                  alert("You need to type connecting Quark");
                  return false;
                }
                if (!formVariables.relation) {
                  alert("Relation is required");
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
SubmitGluon.propTypes = {
  targetQuark: PropTypes.object.isRequired,
  formVariables: PropTypes.object.isRequired
};
export default withRouter(withLastLocation(SubmitGluon));
