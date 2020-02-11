import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
import { gluonFields } from "./fields-gluon";
// constancts
import { QUARK as queryName } from "../constants/query-names";

const queryQuarkCompiled = _.template(`
  query Quark($name: String, $user_id: String, $is_admin: Boolean = false) {
    <%= queryName %>(name: $name, user_id: $user_id, is_admin: $is_admin) {
      ${quarkFields}
      objects(user_id: $user_id, is_admin: $is_admin) {
        ${quarkFields}
        gluon {
          ${gluonFields}
        }
        objects(first: 20, user_id: $user_id, is_admin: $is_admin) {
          ${quarkFields}
          gluon {
            ${gluonFields}
          }
        }
      }
      properties {
        caption
        caption_ja
        qpropertyGtypes {
          caption
          caption_ja
          gluon_type_id
        }
        objects {
          ${quarkFields}
          gluon {
            ${gluonFields}
          }
          objects {
            ${quarkFields}
            gluon {
              ${gluonFields}
            }
          }
        }
      }
    }
  }
`);
class GraphOnQuark {
  constructor() {
    return [queryName, gql(queryQuarkCompiled({ queryName }))];
  }
}
export default GraphOnQuark;
