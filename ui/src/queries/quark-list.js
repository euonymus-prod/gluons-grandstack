import gql from "graphql-tag";

export const QUARK_LIST = gql`
  query quarks($first: Int) {
    quarks(first: $first) {
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
`;
