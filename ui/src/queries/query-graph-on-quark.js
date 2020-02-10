import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
import { gluonFields } from "./fields-gluon";
import { querySelector } from "../utils/auth-util";
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
        objects<%= onlyUserIdParam %> {
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
        }
        objects {
          ${quarkFields}
          gluon {
            ${gluonFields}
          }
          objects<%= onlyUserIdParam %> {
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
    const [queryName, user_id] = querySelector(
      authUser,
      QUERY_NAME.READER_QUARK,
      QUERY_NAME.USER_QUARK,
      QUERY_NAME.ADMIN_QUARK
    );

    let onlyUserIdParam = "";
    let addingUserIdParam = "";
    if (queryName === QUERY_NAME.USER_QUARK) {
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
