import React from "react";
import PropTypes from "prop-types";
import Gluon from "./gluon";
import { getObjectId } from "../utils/common";
// import './assets/styles/baryon.css'
// Material UI
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";

const useStyles = makeStyles({
  card: {
    backgroundColor: "#e5f1f1",
    // backgroundColor: "#40c3c2",
    marginBottom: "35px"
  },
  root: {
    // backgroundColor: theme.palette.background.paper,
    // backgroundColor: '#e6e6f5'
    padding: "10px"
  }
});

const PropertyBox = props => {
  const { propertyResource, hasSecondLevel, objects, subject } = props;
  const classes = useStyles();
  const gluonsList = propertyResource.gluons.map((gluon, key) => {
    const object_id = getObjectId(subject.id, gluon);
    const object = objects
      .filter(data => {
        return data.id === object_id;
      })
      .shift();

    return (
      <Gluon
        key={key}
        gluon={gluon}
        subject={subject}
        object={object}
        hasSecondLevel={hasSecondLevel}
        isTop={key === 0}
      />
    );
  });
  if (gluonsList.length === 0) {
    return null;
  }
  return (
    <div className="property-box">
      <Card className={classes.card}>
        <h2>{propertyResource.caption_ja}</h2>
        <List className={classes.root}>{gluonsList}</List>
      </Card>
    </div>
  );
};

PropertyBox.propTypes = {
  propertyResource: PropTypes.shape({
    caption: PropTypes.string.isRequired
  }),
  subject: PropTypes.object.isRequired,
  objects: PropTypes.array.isRequired,
  hasSecondLevel: PropTypes.bool.isRequired
};
PropertyBox.defaultProps = {
  hasSecondLevel: false
};

export default PropertyBox;
