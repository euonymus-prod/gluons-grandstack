import _ from "lodash";
import gql from "graphql-tag";
import * as QUERY_NAME from "../constants/query-names";

const quarkListCompiled = _.template(`
  query searchQuarks($first: Int, $keyword: String) {
    <%= queryName %>(first: $first, keyword: $keyword<%= addingUserIdParam %>) {
      id
      name
      description
      image_path
      start {
        year
        month
        day
      }
      end {
        year
        month
        day
      }
      start_accuracy
      end_accuracy
      is_momentary
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
    return gql(quarkListCompiled({ queryName, addingUserIdParam }));
  }
}
export default QuarkListSearched;