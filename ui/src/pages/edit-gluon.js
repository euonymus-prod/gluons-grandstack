import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { withAuthUser } from "../providers/session";
import { Query } from "react-apollo";
import EditingGluon from "../queries/query-editing-gluon";
import GluonForm from "../components/form-gluon";
import Util from "../utils/common";
// import { convertTableForTemporallyUse } from "../utils/auth-util";
import * as ROUTES from "../constants/routes";
import LoggedinOnly from "../components/loggedin-only";
// Material UI
import Button from "@material-ui/core/Button";

const util = new Util(false);

const EditGluon = props => {
  return (
    <LoggedinOnly>
      <EditGluonWrapper {...props} />
    </LoggedinOnly>
  );
};

const EditGluonBase = props => {
  const { authUser } = props;
  const user_id = authUser ? authUser.uid : null;
  // const user_id = convertTableForTemporallyUse[authUser.uid];
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
          <div className="container form-container">
            {!editingGluon ? (
              <h1>No gluon found</h1>
            ) : (
              <Fragment>
                <h1>
                  <FormattedMessage
                    id="title_edit_gluon"
                    defaultMessage={`Relation between { active_quark } and { passive_quark }`}
                    values={{
                      active_quark: (
                        <span>
                          {util.localedProp(editingGluon.active, "name")}
                        </span>
                      ),
                      passive_quark: (
                        <span>
                          {util.localedProp(editingGluon.passive, "name")}
                        </span>
                      )
                    }}
                  />
                </h1>
                <GluonForm editingGluon={editingGluon} />
                <br />
                <br />
                <Link
                  to={`${ROUTES.GRAPH_BASE}${editingGluon.active.name}`}
                  alt={editingGluon.active.name}
                >
                  <Button variant="contained">Back to Quark</Button>
                </Link>
              </Fragment>
            )}
          </div>
        );
      }}
    </Query>
  );
};

const EditGluonWrapper = withAuthUser(EditGluonBase);
export default EditGluon;
