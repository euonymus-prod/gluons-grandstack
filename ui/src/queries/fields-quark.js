import { periodFields } from "./fields-period";

export const quarkFields = `
  id
  name
  description
  name_ja
  description_ja
  image_path
  ${periodFields}
  url
  affiliate
  is_private
  user_id
  is_exclusive
  quark_type_id
`;
