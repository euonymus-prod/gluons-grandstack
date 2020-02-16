import gql from "graphql-tag";

export const QUARK_DELETE_MUTATION = gql`
  mutation mutateQuark(
    $id: ID!
    $user_id: String!
    $is_admin: Boolean = false
  ) {
    DeleteQuark(id: $id, user_id: $user_id, is_admin: $is_admin) {
      id
      name
    }
  }
`;
