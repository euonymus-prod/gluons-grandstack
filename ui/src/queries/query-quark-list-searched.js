import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
import { querySelector } from "../utils/auth-util";
// constancts
import * as QUERY_NAME from "../constants/query-names";

const quarkListCompiled = _.template(`
  query searchQuarks($first: Int, $keyword: String) {
    <%= queryName %>(first: $first, keyword: $keyword<%= addingUserIdParam %>) {
    <%= quarkFields %>
    }
  }
`);
class QuarkListSearched {
  constructor(props) {
    const { authUser } = props;
    const [queryName, user_id] = querySelector(
      authUser,
      QUERY_NAME.READER_SEARCH_QUARKS,
      QUERY_NAME.USER_SEARCH_QUARKS,
      QUERY_NAME.ADMIN_SEARCH_QUARKS
    );

    let addingUserIdParam = "";
    if (queryName === QUERY_NAME.USER_SEARCH_QUARKS) {
      const userIdParam = `user_id: "${user_id}"`;
      addingUserIdParam = `, ${userIdParam}`;
    }
    return [
      queryName,
      gql(quarkListCompiled({ queryName, addingUserIdParam, quarkFields }))
    ];
  }
}
export default QuarkListSearched;
