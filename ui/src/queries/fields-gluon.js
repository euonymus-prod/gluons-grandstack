import { periodFields } from "./fields-period";

export const gluonFields = `
  id
  prefix
  relation
  suffix
  active_id
  passive_id
  ${periodFields}
  is_exclusive
  gluon_type_id
`;
