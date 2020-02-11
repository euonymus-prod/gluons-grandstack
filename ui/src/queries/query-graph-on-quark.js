import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
import { gluonFields } from "./fields-gluon";
// constancts
import * as QUERY_NAME from "../constants/query-names";

const queryQuarkCompiled = _.template(`
  query Quark($name: String) {
    <%= queryName %>(name: $name<%= addingUserIdParam %>) {
      ${quarkFields}
      objects<%= onlyUserIdParam %> {
        ${quarkFields}
        gluon {
          ${gluonFields}
        }
        objects(first: 20<%= addingUserIdParam %>) {
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
  constructor(props) {
    // queryName, user_id = null
    const { authUser } = props;
    const queryName = QUERY_NAME.QUARK;
    const user_id = authUser ? authUser.uid : null;

    let onlyUserIdParam = "";
    let addingUserIdParam = "";
    if (user_id !== null) {
      const userIdParam = `user_id: "${user_id}"`;
      onlyUserIdParam = `(${userIdParam})`;
      addingUserIdParam = `, ${userIdParam}`;
    }
    return [
      queryName,
      gql(queryQuarkCompiled({ queryName, onlyUserIdParam, addingUserIdParam }))
    ];
  }
}
export default GraphOnQuark;
