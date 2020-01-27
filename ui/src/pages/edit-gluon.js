import React from "react";
import { Link } from "react-router-dom";
import { withAuthUser } from "../providers/session";
import { Query } from "react-apollo";
import EditingGluon from "../queries/query-editing-gluon";
import QuarkForm from "../components/form-quark";
import { convertTableForTemporallyUse } from "../utils/auth-util";
import * as ROUTES from "../constants/routes";
import LoggedinOnly from "../components/loggedin_only";
// Material UI
import Button from "@material-ui/core/Button";

const EditGluon = props => {
  return (
    <LoggedinOnly>
      <EditGluonWrapper {...props} />
    </LoggedinOnly>
  );
};

const EditGluonBase = props => {
  const { authUser } = props;
  const user_id = convertTableForTemporallyUse[authUser.uid];
  const EDITING_GLUON = new EditingGluon(user_id);
  const variables = {
    id: props.match.params.gluon_id
  };
  return (
    <Query query={EDITING_GLUON} variables={variables}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) {
          return `Error! ${error.message}`;
        }
        const { editingGluon } = data;
        return (
          <div className="EditGluon">
            <h1>Edit Gluon</h1>
            {/*
            <QuarkForm editingGluon={editingGluon} />
            <br />
            <Link
              to={`${ROUTES.GRAPH_BASE}${editingQuark.name}`}
              alt={editingQuark.name}
            >
              <Button variant="contained" color="primary">
                Back to Quark
              </Button>
            </Link>
            */}
          </div>
        );
      }}
    </Query>
  );
};

const EditGluonWrapper = withAuthUser(EditGluonBase);
export default EditGluon;
