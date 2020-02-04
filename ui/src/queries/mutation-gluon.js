import _ from "lodash";
import gql from "graphql-tag";
import * as QUERY_NAME from "../constants/query-names";
import { gluonFields } from "./fields-gluon";

const gluonMutationCompiled = _.template(`
  mutation mutateGluon(
    <%= dynamicSchema %>
    $gluon_type_id: Int!
    $relation: String
    $suffix: String
    $prefix: String
    $relation_ja: String
    $suffix_ja: String
    $prefix_ja: String
    $start: _Neo4jDateTimeInput
    $end: _Neo4jDateTimeInput
    $start_accuracy: String
    $end_accuracy: String
    $is_momentary: Boolean!
    $is_exclusive: Boolean!
  ) {
    <%= mutationName %>(
      <%= dynamicParam %>
      gluon_type_id: $gluon_type_id
      relation: $relation
      suffix: $suffix
      prefix: $prefix
      relation_ja: $relation_ja
      suffix_ja: $suffix_ja
      prefix_ja: $prefix_ja
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
    let dynamicSchema = "";
    let dynamicParam = "";
    if (mutationName === QUERY_NAME.UPDATE_GLUON) {
      dynamicSchema = "$id: ID!";
      dynamicParam = "id: $id";
    } else {
      dynamicSchema = `
        $active_id: ID!
        $passive_id: ID
        $passive: String
      `;
      dynamicParam = `
        active_id: $active_id
        passive_id: $passive_id
        passive: $passive
      `;
    }

    return gql(
      gluonMutationCompiled({ mutationName, dynamicSchema, dynamicParam })
    );
  }
}
export default GluonMutation;
