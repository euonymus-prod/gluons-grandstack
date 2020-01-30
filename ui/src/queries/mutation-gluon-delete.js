import gql from "graphql-tag";

export const GLUON_DELETE_MUTATION = gql`
  mutation mutateGluon($id: ID!, $user_id: String!) {
    DeleteGluon(id: $id, user_id: $user_id) {
      id
      name
    }
  }
`;
