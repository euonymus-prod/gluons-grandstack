import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";

export const POST_MUTATION = gql`
  mutation CreateQuark(
    $quark_type_id: Int!
    $name: String!
    $image_path: String
    $description: String
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
    CreateQuark(
      quark_type_id: $quark_type_id
      name: $name
      image_path: $image_path
      description: $description
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
`;
