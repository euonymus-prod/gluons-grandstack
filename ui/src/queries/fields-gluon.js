import { periodFields } from "./fields-period";

export const gluonFields = `
  id
  prefix
  relation
  suffix
  prefix_ja
  relation_ja
  suffix_ja
  active_id
  passive_id
  ${periodFields}
  is_exclusive
  gluon_type_id
`;
