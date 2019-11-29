import React from "react";
import PropTypes from "prop-types";
import Gluon from "./gluon";
// import './assets/styles/baryon.css'
// Material UI
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";

const useStyles = makeStyles({
  root: {
    // backgroundColor: theme.palette.background.paper,
    // backgroundColor: '#e6e6f5'
    backgroundColor: "#666666"
  }
});

const PropertyBox = props => {
  const { propertyResource, hasSecondLevel, objects, subject } = props;
  const classes = useStyles();
  const gluonsList = propertyResource.gluons.map((gluon, key) => {
    const object = objects
      .filter(data => {
        return data.id === gluon.object_id;
      })
      .shift();

    return (
      <Gluon
        key={key}
        gluon={gluon}
        subject={subject}
        object={object}
        hasSecondLevel={hasSecondLevel}
      />
    );
  });
  if (gluonsList.length === 0) {
    return null;
  }
  return (
    <div>
      <h2>{propertyResource.caption}</h2>
      <Card className={classes.card}>
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
