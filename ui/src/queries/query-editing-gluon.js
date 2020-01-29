import _ from "lodash";
import gql from "graphql-tag";
import { gluonFields } from "./fields-gluon";
import { quarkFields } from "./fields-quark";

// NOTE: This is a component to salvage a gluon for editing purpose
const queryGluonCompiled = _.template(`
  query editingGluon($id: ID) {
    editingGluon(id: $id<%= addingUserIdParam %>) {
      ${gluonFields}
      active {
        ${quarkFields}
      }
      passive {
        ${quarkFields}
      }
    }
  }
`);
class EditingGluon {
  constructor(user_id = null) {
    let addingUserIdParam = "";

    const userIdParam = `user_id: "${user_id}"`;
    addingUserIdParam = `, ${userIdParam}`;
    return gql(queryGluonCompiled({ addingUserIdParam }));
  }
}
export default EditingGluon;
