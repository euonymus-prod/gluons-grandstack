// react
import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import * as ROUTES from "../constants/routes";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import GridListTileBar from "@material-ui/core/GridListTileBar";

const useStyles = makeStyles(theme => ({
  media: {
    paddingTop: "65%"
  },
  title: {
    // color: theme.palette.primary.light,
    color: "white"
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
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
      <GridListTileBar
        title={quark.name}
        classes={{
          root: classes.titleBar,
          title: classes.title
        }}
      />
    </CardActionArea>
  );
};
export default withRouter(TopPickupDetail);
