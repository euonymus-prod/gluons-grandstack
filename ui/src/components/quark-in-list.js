import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Util from "../utils/common";
import noImage from "../assets/images/no_image.jpg";
// constants
import * as ROUTES from "../constants/routes";
// material ui
import { withStyles, withTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  card: {
    display: "flex",
    marginBottom: "13px"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: 151
  }
});

class QuarkInList extends Component {
  render() {
    const { classes, theme, data } = this.props;

    let util = new Util();
    return (
      <Link to={`${ROUTES.GRAPH_BASE}${data.name}`}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cover}
            image={data.image_path ? data.image_path : noImage}
            title={data.name}
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                {data.name}
              </Typography>
              <Typography>{util.period2str(data)}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {data.description}
              </Typography>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }
}
QuarkInList.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image_path: PropTypes.string,
    description: PropTypes.string
  })
};
QuarkInList.defaultProps = {
  data: {
    name: "name",
    image_path: noImage,
    description: "description",
    start: "1999-12-31"
  }
};
export default withTheme(withStyles(styles)(QuarkInList));
