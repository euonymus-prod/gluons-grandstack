import _ from "lodash";
import gql from "graphql-tag";
import * as QUERY_NAME from "../constants/query-names";
import { quarkFields } from "./fields-quark";

const quarkMutationCompiled = _.template(`
  mutation mutateQuark(
    <%= isAdminSchema %>
    <%= userIdSchema %>
    <%= idSchema %>
    $quark_type_id: Int!
    $name: String
    $name_ja: String
    $image_path: String
    $description: String
    $description_ja: String
    $start: _Neo4jDateTimeInput
    $end: _Neo4jDateTimeInput
    $start_accuracy: String
    $end_accuracy: String
    $is_momentary: Boolean!
    $url: String
    $affiliate: String
    $is_private: Boolean!
    $is_exclusive: Boolean!
  ) {
    <%= mutationName %>(
      <%= isAdminParam %>
      <%= userIdParam %>
      <%= idParam %>
      quark_type_id: $quark_type_id
      name: $name
      name_ja: $name_ja
      image_path: $image_path
      description: $description
      description_ja: $description_ja
      start: $start
      end: $end
      start_accuracy: $start_accuracy
      end_accuracy: $end_accuracy
      is_momentary: $is_momentary
      url: $url
      affiliate: $affiliate
      is_private: $is_private
      is_exclusive: $is_exclusive
    ) {
      ${quarkFields}
    }
  }
`);
class QuarkMutation {
  constructor(mutationName) {
    let idSchema = "";
    let idParam = "";
    let userIdSchema = "";
    let userIdParam = "";
    let isAdminSchema = "";
    let isAdminParam = "";
    if (mutationName === QUERY_NAME.UPDATE_QUARK) {
      idSchema = "$id: ID!";
      idParam = "id: $id";
      userIdSchema = "$user_id: String";
      userIdParam = "user_id: $user_id";
      isAdminSchema = "$is_admin: Boolean = false";
      isAdminParam = "is_admin: $is_admin";
    }

    return gql(
      quarkMutationCompiled({
        mutationName,
        idSchema,
        idParam,
        userIdSchema,
        userIdParam,
        isAdminSchema,
        isAdminParam
      })
    );
  }
}
export default QuarkMutation;
