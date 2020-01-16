import _ from "lodash";
import gql from "graphql-tag";
import * as QUERY_NAME from "../constants/query-names";
import { queryFields } from "./quark-fields";

const quarkListCompiled = _.template(`
  query quarks($first: Int) {
    <%= queryName %>(first: $first<%= addingUserIdParam %>) {
    <%= queryFields %>
    }
  }
`);
class QuarkList {
  constructor(queryName, user_id = null) {
    let addingUserIdParam = "";
    if (queryName === QUERY_NAME.USER_QUARKS) {
      const userIdParam = `user_id: ${user_id}`;
      addingUserIdParam = `, ${userIdParam}`;
    }
    return gql(
      quarkListCompiled({ queryName, addingUserIdParam, queryFields })
    );
  }
}
export default QuarkList;
