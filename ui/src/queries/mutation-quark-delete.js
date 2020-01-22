import gql from "graphql-tag";

export const QUARK_DELETE_MUTATION = gql`
  mutation mutateQuark($id: ID!, $user_id: Int!) {
    DeleteQuark(id: $id, user_id: $user_id) {
      id
      name
    }
  }
`;
