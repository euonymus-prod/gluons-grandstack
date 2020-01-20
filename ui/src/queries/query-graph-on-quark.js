import _ from "lodash";
import gql from "graphql-tag";
import { quarkFields } from "./fields-quark";
import { gluonFields } from "./fields-gluon";

import * as QUERY_NAME from "../constants/query-names";

const queryQuarkCompiled = _.template(`
  query Quark($name: String) {
    <%= queryName %>(name: $name<%= addingUserIdParam %>) {
      ${quarkFields}
      gluons<%= onlyUserIdParam %> {
        ${gluonFields}
      }
      objects<%= onlyUserIdParam %> {
        ${quarkFields}
        gluons<%= onlyUserIdParam %> {
          ${gluonFields}
        }
        objects<%= onlyUserIdParam %> {
          ${quarkFields}
        }
      }
      properties {
        caption
        caption_ja
        qpropertyGtypes {
          caption
          caption_ja
        }
        gluons {
          ${gluonFields}
        }
      }
    }
  }
`);
class GraphOnQuark {
  constructor(queryName, user_id = null) {
    let onlyUserIdParam = "";
    let addingUserIdParam = "";
    if (queryName === QUERY_NAME.USER_QUARK) {
      const userIdParam = `user_id: ${user_id}`;
      onlyUserIdParam = `(${userIdParam})`;
      addingUserIdParam = `, ${userIdParam}`;
    }
    return gql(
      queryQuarkCompiled({ queryName, onlyUserIdParam, addingUserIdParam })
    );
  }
}
export default GraphOnQuark;
