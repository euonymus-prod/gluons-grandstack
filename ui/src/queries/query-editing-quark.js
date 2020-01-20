import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
import { gluonFields } from "./fields-gluon";

import * as QUERY_NAME from "../constants/query-names";

const queryQuarkCompiled = _.template(`
  query editingQuark($id: ID) {
    editingQuark(id: $id<%= addingUserIdParam %>) {
      ${quarkFields}
    }
  }
`);
class EditingQuark {
  constructor(user_id = null) {
    let addingUserIdParam = "";

    const userIdParam = `user_id: ${user_id}`;
    addingUserIdParam = `, ${userIdParam}`;
    return gql(queryQuarkCompiled({ addingUserIdParam }));
  }
}
export default EditingQuark;
