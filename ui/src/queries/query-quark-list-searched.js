import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
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
    const queryName = QUERY_NAME.SEARCH_QUARKS;
    const user_id = authUser ? authUser.uid : null;

    let addingUserIdParam = "";
    if (user_id !== null) {
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
