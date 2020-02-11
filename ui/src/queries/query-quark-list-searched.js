import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
// constancts
import { SEARCH_QUARKS as queryName } from "../constants/query-names";

const quarkListCompiled = _.template(`
  query searchQuarks($first: Int, $keyword: String, $user_id: String, $is_admin: Boolean = false) {
    <%= queryName %>(first: $first, keyword: $keyword, user_id: $user_id, is_admin: $is_admin) {
      ${quarkFields}
    }
  }
`);

class QuarkListSearched {
  constructor() {
    return [queryName, gql(quarkListCompiled({ queryName }))];
  }
}
export default QuarkListSearched;
