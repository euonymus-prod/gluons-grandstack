import _ from "lodash";
import gql from "graphql-tag";
import * as QUERY_NAME from "../constants/query-names";
import { quarkFields } from "./fields-quark";

const quarkListCompiled = _.template(`
  query searchQuarks($first: Int, $keyword: String) {
    <%= queryName %>(first: $first, keyword: $keyword<%= addingUserIdParam %>) {
    <%= quarkFields %>
    }
  }
`);
class QuarkListSearched {
  constructor(queryName, user_id = null) {
    let addingUserIdParam = "";
    if (queryName === QUERY_NAME.USER_SEARCH_QUARKS) {
      const userIdParam = `user_id: ${user_id}`;
      addingUserIdParam = `, ${userIdParam}`;
    }
    return gql(
      quarkListCompiled({ queryName, addingUserIdParam, quarkFields })
    );
  }
}
export default QuarkListSearched;
