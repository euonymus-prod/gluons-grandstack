import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";

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
  quarkImage: {
    height: IMAGE_HEIGHT,
    width: "auto"
  },
  tile: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
    textAlign: "center"
  }
}));

const onLinkClick = name => {
  const link = `${ROUTES.GRAPH_BASE}${name}`;
  console.log(link);
};
const SecondGluon = props => {
  const classes = useStyles();

  const { subject, object, gluon } = props;
  const actionIcon = (
    <IconButton
      aria-label={`star ${object.name}`}
      onClick={() => {
        onLinkClick(object.name);
      }}
    >
      <OpenInBrowserIcon className={classes.title} />
    </IconButton>
  );

  return (
    <GridListTile
      classes={{ imgFullHeight: classes.imgFullHeight, tile: classes.tile }}
      style={{ width: IMAGE_WIDTH }}
    >
      <img
        src={object.image_path}
        alt={object.name}
        className={classes.quarkImage}
      />
      <GridListTileBar
        title={object.name}
        classes={{
          root: classes.titleBar,
          title: classes.title
        }}
        actionIcon={actionIcon}
      />
    </GridListTile>
  );
};

SecondGluon.propTypes = {
  subject: PropTypes.object.isRequired,
  object: PropTypes.object.isRequired,
  gluon: PropTypes.object.isRequired
};

export default SecondGluon;
