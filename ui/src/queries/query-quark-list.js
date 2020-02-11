import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
// constancts
import { QUARKS as queryName } from "../constants/query-names";

const quarkListCompiled = _.template(`
  query quarks($first: Int, $user_id: String, $is_admin: Boolean = false) {
    <%= queryName %>(first: $first, user_id: $user_id, is_admin: $is_admin) {
      ${quarkFields}
    }
  }
`);
class QuarkList {
  constructor() {
    return [queryName, gql(quarkListCompiled({ queryName }))];
  }
}
export default QuarkList;
