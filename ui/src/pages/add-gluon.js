import React from "react";
import { Link } from "react-router-dom";
import { withAuthUser } from "../providers/session";
import { Query } from "react-apollo";
import EditingQuark from "../queries/query-editing-quark";
import GluonForm from "../components/form-gluon";
import { convertTableForTemporallyUse } from "../utils/auth-util";
import * as ROUTES from "../constants/routes";
import LoggedinOnly from "../components/loggedin_only";
// Material UI
import Button from "@material-ui/core/Button";

const AddNewGluon = props => (
  <LoggedinOnly>
    <AddNewGluonWrapper {...props} />
  </LoggedinOnly>
);

const AddNewGluonBase = props => {
  const { authUser } = props;
  const user_id = convertTableForTemporallyUse[authUser.uid];
  const EDITING_QUARK = new EditingQuark(user_id);
  const variables = {
    id: props.match.params.quark_id
  };
  return (
    <Query query={EDITING_QUARK} variables={variables}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        const { editingQuark } = data;
        return (
          <div className="AddNewGluon">
            <h1>Add New Gluon on {editingQuark.name}</h1>
            <GluonForm targetQuark={editingQuark} />
            <br />
            <Link
              to={`${ROUTES.GRAPH_BASE}${editingQuark.name}`}
              alt={editingQuark.name}
            >
              <Button variant="contained" color="primary">
                Back to Quark
              </Button>
            </Link>
          </div>
        );
      }}
    </Query>
  );
};

const AddNewGluonWrapper = withAuthUser(AddNewGluonBase);
export default AddNewGluon;
