import React from "react";
import PropTypes from "prop-types";
import Gluon from "./gluon";
// import Util, { getObjectId } from "../utils/common";
import Util from "../utils/common";
// import './assets/styles/baryon.css'
// Material UI
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";

const util = new Util(false);

const useStyles = makeStyles({
  card: {
    backgroundColor: "#e5f1f1",
    color: "#878765",
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
  const { propertyResource, hasSecondLevel, subject } = props;
  const classes = useStyles();
  // const gluonsList = propertyResource.gluons.map((gluon, key) => {
  //   const object_id = getObjectId(subject.id, gluon);
  //   const object = objects
  //     .filter(data => {
  //       return data.id === object_id;
  //     })
  //     .shift();
  //   object.name = util.localedProp(object, "name");
  //   object.description = util.localedProp(object, "description");
  //   gluon.relation = util.localedProp(gluon, "relation");
  //   gluon.prefix = util.localedProp(gluon, "prefix");
  //   gluon.suffix = util.localedProp(gluon, "suffix");
  //
  //   return (
  //     <Gluon
  //       key={key}
  //       gluon={gluon}
  //       subject={subject}
  //       object={object}
  //       hasSecondLevel={hasSecondLevel}
  //       isTop={key === 0}
  //     />
  //   );
  // });
  const gluonsList = propertyResource.objects.map((object, key) => {
    object.name = util.localedProp(object, "name");
    object.description = util.localedProp(object, "description");
    object.gluon.relation = util.localedProp(object.gluon, "relation");
    object.gluon.prefix = util.localedProp(object.gluon, "prefix");
    object.gluon.suffix = util.localedProp(object.gluon, "suffix");

    return (
      <Gluon
        key={key}
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
        <h2>{util.localedProp(propertyResource, "caption")}</h2>
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
  hasSecondLevel: PropTypes.bool.isRequired
};
PropertyBox.defaultProps = {
  hasSecondLevel: false
};

export default PropertyBox;
