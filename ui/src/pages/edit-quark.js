import React from "react";
import { Link } from "react-router-dom";
import { withAuthUser } from "../providers/session";
import { Query } from "react-apollo";
import EditingQuark from "../queries/query-editing-quark";
import QuarkForm from "../components/form-quark";
import { convertTableForTemporallyUse } from "../utils/auth-util";
import * as ROUTES from "../constants/routes";
import LoggedinOnly from "../components/loggedin_only";
// Material UI
import Button from "@material-ui/core/Button";

const EditQuark = props => {
  return (
    <LoggedinOnly>
      <EditQuarkWrapper {...props} />
    </LoggedinOnly>
  );
};

const EditQuarkBase = props => {
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
          <div className="EditQuark">
            <h1>Edit Quark</h1>
            <QuarkForm editingQuark={editingQuark} />
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

const EditQuarkWrapper = withAuthUser(EditQuarkBase);
export default EditQuark;
