import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";
import { Mutation } from "react-apollo";
import QuarkMutation from "../queries/mutation-quark";
// Material UI
import Button from "@material-ui/core/Button";

const QUARKS_PER_PAGE = 20;
// TODO
const QUARKS_QUERY = "";

class SubmitQuark extends Component {
  updateAfterMutation = (store, { data: { CreateQuark } }) => {
    const first = QUARKS_PER_PAGE;
    const skip = 0;
    const orderBy = "created";

    // Note: you need try catch, so error doesn't happen even if QUARKS_QUERY is not yet provided.
    try {
      const data = store.readQuery({
        query: QUARKS_QUERY,
        variables: { first, skip, orderBy }
      });
      data.quarks.unshift(CreateQuark);
      store.writeQuery({
        query: QUARKS_QUERY,
        data,
        variables: { first, skip, orderBy }
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

    let mutationName = "CreateQuark";
    if (variables.id) {
      mutationName = "UpdateQuark";
    }
    const mutation = new QuarkMutation(mutationName);
    return (
      <Mutation
        mutation={mutation}
        variables={variables}
        onCompleted={data => {
          this.props.history.push(`/graph/${data[mutationName].name}`);
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
export default withRouter(withLastLocation(SubmitQuark));
