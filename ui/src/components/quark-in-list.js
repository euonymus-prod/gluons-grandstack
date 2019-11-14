import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Util from "../utils/common";
import noImage from "../assets/images/no_image.jpg";

import { withStyles, withTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";

const styles = theme => ({
  card: {
    display: "flex"
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
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38
  }
});

class QuarkInList extends Component {
  render() {
    const { classes, theme, data } = this.props;

    let util = new Util();
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.cover}
          image={data.image_path}
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
