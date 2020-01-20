import gql from "graphql-tag";
import { periodFields } from "./fields-period";

export const quarkFields = `
  id
  name
  description
  image_path
  ${periodFields}
  url
  affiliate
  is_private
  user_id
  is_exclusive
  quark_type_id
`;
