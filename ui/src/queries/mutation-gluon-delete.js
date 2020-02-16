import gql from "graphql-tag";

export const GLUON_DELETE_MUTATION = gql`
  mutation mutateGluon(
    $id: ID!
    $user_id: String!
    $is_admin: Boolean = false
  ) {
    DeleteGluon(id: $id, user_id: $user_id, is_admin: $is_admin) {
      id
      name
    }
  }
`;
