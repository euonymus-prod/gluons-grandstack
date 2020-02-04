// react
import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
// general
import Util from "../utils/common";
// component
import TopPickupDetail from "./top-pickup-detail";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const util = new Util(false);
const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});
export const QUARKS_QUERY = gql`
  query FeedQuery {
    topQuarks {
      id
      name
      name_ja
      image_path
    }
  }
`;

class TopPickups extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Query query={QUARKS_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return "Loading";
          if (error) return "Error";
          if (data.topQuarks.length === 0) {
            return "No Data for the top page";
          }

          return (
            <div className={classes.root}>
              <Grid container spacing={3}>
                {data.topQuarks.map((data, index) => {
                  data.name = util.localedProp(data, "name");
                  return (
                    <Grid item xs={6} sm={3} key={data.id}>
                      <TopPickupDetail quark={data} />
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          );
        }}
      </Query>
    );
  }
}
export default withStyles(styles)(TopPickups);
