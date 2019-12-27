import React from "react";
import PropTypes from "prop-types";
import PropertyBox from "./property-box";

const Gluons = props => {
  const { parentQuark, hasSecondLevel } = props;

  if (!parentQuark) {
    return null;
  }

  const subject = {
    id: parentQuark.id,
    name: parentQuark.name
  };

  const propertyList = parentQuark.properties.map((propertyResource, key) => {
    return (
      <PropertyBox
        key={key}
        propertyResource={propertyResource}
        subject={subject}
        objects={parentQuark.objects}
        hasSecondLevel={hasSecondLevel}
      />
    );
  });

  return <div className="baryon-properties baryon-grid">{propertyList}</div>;
};

Gluons.propTypes = {
  parentQuark: PropTypes.object.isRequired,
  hasSecondLevel: PropTypes.bool.isRequired
};
Gluons.defaultProps = {
  hasSecondLevel: false
};

export default Gluons;
