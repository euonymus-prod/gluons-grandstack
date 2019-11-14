import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "../assets/styles/UserList.css";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper
} from "@material-ui/core";

const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300
  }
});

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

function SearchQuarkDemo(props) {
  const { classes } = props;

  const [rowsPerPage] = React.useState(10);

  const { loading, data, error } = useQuery(SEARCH_QUARKS, {
    variables: {
      first: rowsPerPage,
      keyword: "徳川"
    }
  });

  return (
    <Paper className={classes.root}>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}
      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableBody>
            {data.searchQuarks.map(n => {
              return (
                <TableRow key={n.id}>
                  <TableCell component="th" scope="row">
                    {n.name}
                  </TableCell>
                  <TableCell>{n.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default withStyles(styles)(SearchQuarkDemo);
