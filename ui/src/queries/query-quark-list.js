import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
// constancts
import * as QUERY_NAME from "../constants/query-names";

const quarkListCompiled = _.template(`
  query quarks($first: Int) {
    <%= queryName %>(first: $first<%= addingUserIdParam %>) {
    <%= quarkFields %>
    }
  }
`);
class QuarkList {
  constructor(props) {
    const { authUser } = props;
    const queryName = QUERY_NAME.QUARKS;
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
export default QuarkList;
