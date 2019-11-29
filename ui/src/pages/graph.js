// react
import React, { Component } from "react";
// GraphQL
import { Query } from "react-apollo";
import gql from "graphql-tag";
// component
import MainQuark from "../components/main-quark";
import Gluons from "../components/gluons";

// GraphQL
const GRAPH_ON_QUARK = gql`
  query Quark($name: String) {
    Quark(name: $name) {
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
          name
        }
      }
      properties {
        caption
        caption_ja
        qpropertyGtypes {
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
class Graph extends Component {
  render() {
    const variables = {
      name: this.props.match.params.quark_name
    };
    return (
      <Query query={GRAPH_ON_QUARK} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          return (
            <div className="baryon-body">
              <MainQuark subject={data.Quark} />
              <Gluons parentQuark={data.Quark} />
            </div>
          );
        }}
      </Query>
    );
  }
}
export default Graph;
