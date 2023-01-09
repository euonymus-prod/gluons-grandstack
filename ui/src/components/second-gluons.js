import React from "react";
import PropTypes from "prop-types";
import SecondGluon from "./second-gluon";
// import Util, { getObjectId } from "../utils/common";
import Util from "../utils/common";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";

const util = new Util(false);

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)"
  }
}));

const SecondGluons = props => {
  const classes = useStyles();

  const { subject, objects } = props;

  const tileData = objects.map(object => {
    // const object_id = getObjectId(subject.id, gluon);
    //
    // const object = objects
    //   .filter(data => {
    //     return data.id === object_id;
    //   })
    //   .shift();
    // object.name = util.localedProp(object, "name");
    // object.description = util.localedProp(object, "description");
    // gluon.relation = util.localedProp(gluon, "relation");
    // gluon.prefix = util.localedProp(gluon, "prefix");
    // gluon.suffix = util.localedProp(gluon, "suffix");
    //
    // return (
    //   <SecondGluon
    //     key={gluon.id}
    //     subject={subject}
    //     object={object}
    //     gluon={gluon}
    //   />
    // );
    object.name = util.localedProp(object, "name");
    object.description = util.localedProp(object, "description");
    object.gluon.relation = util.localedProp(object.gluon, "relation");
    object.gluon.prefix = util.localedProp(object.gluon, "prefix");
    object.gluon.suffix = util.localedProp(object.gluon, "suffix");

    return (
      <SecondGluon key={object.gluon.id} subject={subject} object={object} />
    );
  });

  return (
    <div className={classes.root}>
      <ImageList className={classes.gridList} cols={2.5}>
        {tileData}
      </ImageList>
    </div>
  );
};

SecondGluons.propTypes = {
  subject: PropTypes.object.isRequired,
  objects: PropTypes.array.isRequired
};

export default SecondGluons;
