// react
import React, { Component } from "react";
// GraphQL
import { Query } from "react-apollo";
import gql from "graphql-tag";
// component
import MainQuark from "../components/main-quark";

// GraphQL
const GRAPH_ON_QUARK = gql`
  query graph($name: String) {
    graph(name: $name) {
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
      url
      is_exclusive
      user_id
      gluons {
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
              <MainQuark subject={data.graph} />
            </div>
          );
        }}
      </Query>
    );
  }
}
export default Graph;
