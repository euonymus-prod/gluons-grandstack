import _ from "lodash";
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { withAuthUser } from "../providers/session";
// GraphQL
import QuarkListSearched from "../queries/query-quark-list-searched";
import { querySelector } from "../utils/auth-util";
// component
import QuarkInList from "./quark-in-list";
// constancts
import * as QUERY_NAME from "../constants/query-names";

const ROWS_PER_PAGE = 20;

class InputGluedQuark extends Component {
  state = {
    value: "",
    searchKeyword: ""
  };

  onChange = event => {
    this.props.onChange({ passive: event.target.value });
    this.setState({ value: event.target.value }, () => {
      if (this.state.value && this.state.value.length > 1) {
        if (this.state.value.length % 2 === 0) {
          this.debouncedGetInfo();
        }
      }
    });
  };

  debouncedGetInfo = _.debounce(() => {
    this.setState({ searchKeyword: this.state.value });
  }, 300);

  render() {
    const { authUser } = this.props;
    const [queryName, user_id] = querySelector(
      authUser,
      QUERY_NAME.READER_SEARCH_QUARKS,
      QUERY_NAME.USER_SEARCH_QUARKS,
      QUERY_NAME.ADMIN_SEARCH_QUARKS
    );
    const variables = {
      first: ROWS_PER_PAGE,
      keyword: this.state.searchKeyword
    };

    const GRAPHQL_QUERY = new QuarkListSearched(queryName, user_id);
    return (
      <Fragment>
        <input
          value={this.state.value}
          name="value"
          onChange={this.onChange}
          type="text"
          placeholder="Input Quark Name"
          className={`form-control`}
        />
        {variables.keyword && (
          <Query query={GRAPHQL_QUERY} variables={variables}>
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
              const quarks = data[queryName];
              return (
                <div>
                  {quarks.map(quark => {
                    return <QuarkInList key={quark.id} data={quark} />;
                  })}
                </div>
              );
            }}
          </Query>
        )}
      </Fragment>
    );
  }
}
InputGluedQuark.propTypes = {
  onChange: PropTypes.func.isRequired
};
export default withAuthUser(InputGluedQuark);
