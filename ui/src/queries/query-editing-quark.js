import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
import { gluonFields } from "./fields-gluon";

import * as QUERY_NAME from "../constants/query-names";

const queryQuarkCompiled = _.template(`
  query Quark($name: String) {
    <%= queryName %>(name: $name<%= addingUserIdParam %>) {
      ${quarkFields}
    }
  }
`);
class EditingQuark {
  constructor(queryName, user_id = null) {
    let addingUserIdParam = "";
    if (queryName === QUERY_NAME.USER_QUARK) {
      const userIdParam = `user_id: ${user_id}`;
      addingUserIdParam = `, ${userIdParam}`;
    }
    return gql(queryQuarkCompiled({ queryName, addingUserIdParam }));
  }
}
export default EditingQuark;
