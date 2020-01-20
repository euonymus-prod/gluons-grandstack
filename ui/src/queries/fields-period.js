import gql from "graphql-tag";
export const periodFields = `
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
`;
