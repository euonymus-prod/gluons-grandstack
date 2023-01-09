import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import CardActionArea from "@material-ui/core/CardActionArea";

// Material UI
import { makeStyles } from "@material-ui/core/styles";

const IMAGE_HEIGHT = "104px";
const IMAGE_WIDTH = "180px";

const useStyles = makeStyles(theme => ({
  title: {
    // color: theme.palette.primary.light,
    color: "white"
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  },
  imgFullHeight: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
    objectFit: "cover"
  },
  tile: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH
  },
  quarkImage: {
    width: IMAGE_WIDTH
  }
}));

const SecondGluon = props => {
  const classes = useStyles();

  const { object } = props;

  const onLinkClick = name => {
    props.history.push(`${ROUTES.GRAPH_BASE}${name}`);
  };

  return (
    <CardActionArea onClick={() => onLinkClick(object.name)}>
      <ImageListItem
        classes={{ imgFullHeight: classes.imgFullHeight, tile: classes.tile }}
        style={{ width: IMAGE_WIDTH }}
      >
        <img
          src={object.image_path}
          alt={object.name}
          className={classes.quarkImage}
        />
        <ImageListItemBar
          title={object.name}
          classes={{
            root: classes.titleBar,
            title: classes.title
          }}
        />
      </ImageListItem>
    </CardActionArea>
  );
};

SecondGluon.propTypes = {
  subject: PropTypes.object.isRequired,
  object: PropTypes.object.isRequired
};

export default withRouter(SecondGluon);
