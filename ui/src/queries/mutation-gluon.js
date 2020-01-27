import _ from "lodash";
import gql from "graphql-tag";
import * as QUERY_NAME from "../constants/query-names";
import { gluonFields } from "./fields-gluon";

const gluonMutationCompiled = _.template(`
  mutation mutateGluon(
    <%= idSchema %>
    $gluon_type_id: Int!
    $active_id: ID!
    $passive_id: ID
    $passive: String
    $prefix: String
    $relation: String!
    $suffix: String
    $start: _Neo4jDateTimeInput
    $end: _Neo4jDateTimeInput
    $start_accuracy: String
    $end_accuracy: String
    $is_momentary: Boolean!
    $is_exclusive: Boolean!
  ) {
    <%= mutationName %>(
      <%= idParam %>
      gluon_type_id: $gluon_type_id
      active_id: $active_id
      passive_id: $passive_id
      passive: $passive
      prefix: $prefix
      relation: $relation
      suffix: $suffix
      start: $start
      end: $end
      start_accuracy: $start_accuracy
      end_accuracy: $end_accuracy
      is_momentary: $is_momentary
      is_exclusive: $is_exclusive
    ) {
      ${gluonFields}
    }
  }
`);
class GluonMutation {
  constructor(mutationName) {
    let idSchema = "";
    let idParam = "";
    if (mutationName === QUERY_NAME.UPDATE_GLUON) {
      idSchema = "$id: ID!";
      idParam = "id: $id";
    }

    return gql(gluonMutationCompiled({ mutationName, idSchema, idParam }));
  }
}
export default GluonMutation;
