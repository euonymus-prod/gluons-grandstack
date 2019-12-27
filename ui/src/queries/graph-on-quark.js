import gql from "graphql-tag";
export const GRAPH_ON_QUARK = gql`
  query Quark($name: String) {
    quark(name: $name) {
      id
      quark_type_id
      name
      description
      image_path
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
      url
      is_exclusive
      is_private
      user_id
      gluons {
        gluon_type_id
        active_id
        passive_id
        relation
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
      }
      objects {
        id
        name
        description
        image_path
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
        is_private
        gluons {
          relation
          active_id
          passive_id
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
        }
        objects {
          id
          name
          image_path
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
          active_id
          passive_id
          object_id
          relation
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
        }
      }
    }
  }
`;
