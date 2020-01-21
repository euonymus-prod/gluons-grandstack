import React from "react";
import { withAuthUser } from "../providers/session";
import { Query } from "react-apollo";
import EditingQuark from "../queries/query-editing-quark";
import QuarkForm from "../components/form-quark";
import { convertTableForTemporallyUse } from "../utils/auth-util";

const EditQuark = props => {
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
          </div>
        );
      }}
    </Query>
  );
};

export default withAuthUser(EditQuark);
