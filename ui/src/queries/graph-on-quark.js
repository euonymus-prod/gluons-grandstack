import gql from "graphql-tag";
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

const queryQuark = `
  query Quark($name: String) {
    quark(name: $name) {
      ${fieldsQuark}
      gluons {
        ${fieldsGluon}
      }
      objects {
        ${fieldsQuark}
        gluons {
          ${fieldsGluon}
        }
        objects {
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
`;
export const GRAPH_ON_QUARK = gql(queryQuark);
