import _ from "lodash";
import gql from "graphql-tag";
import * as QUERY_NAME from "../constants/query-names";

const fieldsPeriod = `
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
const fieldsQuark = `
  id
  name
  description
  image_path
  ${fieldsPeriod}
  url
  is_private
  user_id
  is_exclusive
  quark_type_id
`;
const fieldsGluon = `
  id
  relation
  active_id
  passive_id
  ${fieldsPeriod}
  object_id
  gluon_type_id
`;

const queryQuarkCompiled = _.template(`
  query Quark($name: String) {
    <%= queryName %>(name: $name<%= addingUserIdParam %>) {
      ${fieldsQuark}
      gluons<%= onlyUserIdParam %> {
        ${fieldsGluon}
      }
      objects<%= onlyUserIdParam %> {
        ${fieldsQuark}
        gluons<%= onlyUserIdParam %> {
          ${fieldsGluon}
        }
        objects<%= onlyUserIdParam %> {
          ${fieldsQuark}
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
          ${fieldsGluon}
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
