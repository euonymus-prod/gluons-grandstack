// react
import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import * as ROUTES from "../constants/routes";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";

const IMAGE_HEIGHT = "104px";
const IMAGE_WIDTH = "180px";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "100%",
    height: "150px"
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
  },
  media: {
    paddingTop: "65%"
  }
}));

const TopPickupDetail = props => {
  const classes = useStyles();

  const { quark } = props;
  const onLinkClick = name => {
    props.history.push(`${ROUTES.GRAPH_BASE}${name}`);
  };

  const image_path = quark.image_path ? quark.image_path : "/img/thing.png";
  return (
    <CardActionArea onClick={() => onLinkClick(quark.name)}>
      <CardMedia
        className={classes.media}
        image={image_path}
        title={quark.name}
      />
    </CardActionArea>
  );
};
export default withRouter(TopPickupDetail);
