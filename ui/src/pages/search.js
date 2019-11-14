// react
import React from "react";
// GraphQL
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

// component
import QuarkInList from "../components/quark-in-list";

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
  document.title = `Search Result of ${props.match.params.keywords} -\ngluons`;
  const [rowsPerPage] = React.useState(10);

  const { loading, data, error } = useQuery(SEARCH_QUARKS, {
    variables: {
      first: rowsPerPage,
      keyword: "徳川"
    }
  });

  const quark_property_caption = "test caption";
  return (
    <div className="container">
      <h2>{quark_property_caption}</h2>
      <div className="related">
        {loading && !error && <p>Loading...</p>}
        {error && !loading && <p>Error</p>}
        {data && !loading && !error && (
          <div>
            {data.searchQuarks.map(n => {
              return <QuarkInList key={n.id} data={n} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default Search;
