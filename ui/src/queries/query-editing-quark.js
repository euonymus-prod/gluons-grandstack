import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";

// NOTE: This is a component to salvage a quark for editing purpose
const queryQuarkCompiled = _.template(`
  query editingQuark($id: ID, $user_id: String, $is_admin: Boolean = false) {
    editingQuark(id: $id, user_id: $user_id, is_admin: $is_admin) {
      ${quarkFields}
    }
  }
`);
class EditingQuark {
  constructor() {
    return gql(queryQuarkCompiled({}));
  }
}
export default EditingQuark;
