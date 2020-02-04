import React from "react";
import PropTypes from "prop-types";
import SecondGluon from "./second-gluon";
import Util, { getObjectId } from "../utils/common";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";

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

  const { subject, objects, gluons } = props;

  const tileData = gluons.map(gluon => {
    const object_id = getObjectId(subject.id, gluon);

    const object = objects
      .filter(data => {
        return data.id === object_id;
      })
      .shift();
    object.name = util.localedProp(object, "name");
    object.description = util.localedProp(object, "description");
    gluon.relation = util.localedProp(gluon, "relation");
    gluon.prefix = util.localedProp(gluon, "prefix");
    gluon.suffix = util.localedProp(gluon, "suffix");

    return (
      <SecondGluon
        key={gluon.id}
        subject={subject}
        object={object}
        gluon={gluon}
      />
    );
  });

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {tileData}
      </GridList>
    </div>
  );
};

SecondGluons.propTypes = {
  subject: PropTypes.object.isRequired,
  objects: PropTypes.array.isRequired,
  gluons: PropTypes.array.isRequired
};

export default SecondGluons;
