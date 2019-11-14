// react
import React from "react";
// GraphQL
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

// component
import QuarkInList from "../components/quark-in-list";

const rowsPerPage = 100;
const SEARCH_QUARKS = gql`
  query searchQuarks($first: Int, $keyword: String) {
    searchQuarks(first: $first, keyword: $keyword) {
      id
      name
      description
      image_path
    }
  }
`;

function Search(props) {
  const { query } = props.match.params;
  document.title = `Search Result of ${query} -\ngluons`;

  const { loading, data, error } = useQuery(SEARCH_QUARKS, {
    variables: {
      first: rowsPerPage,
      keyword: query
    }
  });

  const quark_property_caption = query;
  return (
    <div className="container">
      <h2>{quark_property_caption}</h2>
      <div className="related">
        {loading && !error && <p>Loading...</p>}
        {error && !loading && <p>Error</p>}
        {data && !loading && !error && (
          <div>
            {data.searchQuarks.map(quark => {
              return <QuarkInList key={quark.id} data={quark} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default Search;
