import gql from "graphql-tag";
import { periodFields } from "./fields-period";

export const gluonFields = `
  id
  relation
  active_id
  passive_id
  ${periodFields}
  object_id
  gluon_type_id
`;
