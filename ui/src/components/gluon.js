import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Util from "../utils/common";
import SecondGluons from "./second-gluons";
import { LANGTYPE_ENG_LIKE, LANGTYPE_JP_LIKE } from "../constants/langtypes";
import * as ROUTES from "../constants/routes";
// Material UI
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

const util = new Util(false);
const useStyles = makeStyles({
  card: {
    margin: "20px",
    display: "block"
  },
  avatarListItem: {
    width: 150
  }
  // NOTE: This used to work, but suddenly stopped working.
  //       The reason is that makeStyles style is imported before MuiAvatar is impoted.
  //       It's hard to change the order because this is treated by transpiler, so I decided to put style inline.
  // avatar: {
  //   width: 130,
  //   height: 130,
  // },
});

const relationTextBuilder = (subject, object, gluon) => {
  let glue_sentence_before_link = "";
  let glue_sentence_after_link = " ";
  const langType = LANGTYPE_JP_LIKE;

  if (subject.id === gluon.active_id) {
    glue_sentence_before_link = subject.name;
    if (langType === LANGTYPE_ENG_LIKE) {
      glue_sentence_before_link += " " + gluon.relation;
    } else {
      glue_sentence_before_link += "は";
      glue_sentence_after_link += gluon.relation;
    }
    glue_sentence_before_link += " ";
    if (gluon.suffix) {
      glue_sentence_after_link += gluon.suffix;
    }
  } else if (subject.id === gluon.passive_id) {
    glue_sentence_before_link = "";
    if (langType === LANGTYPE_ENG_LIKE) {
      glue_sentence_after_link += gluon.relation + " " + subject.name + " ";
    } else {
      glue_sentence_after_link += "は" + subject.name + gluon.relation;
    }
    glue_sentence_before_link += " ";
    if (gluon.suffix) {
      glue_sentence_after_link += gluon.suffix;
    }
  } else {
    return "";
  }

  return (
    <p className="baryon-strong-interaction">
      {glue_sentence_before_link}
      <Link to={`${ROUTES.GRAPH_BASE}${object.name}`}>{object.name}</Link>
      {glue_sentence_after_link}
    </p>
  );
};

const Gluon = props => {
  const { subject, object, gluon, hasSecondLevel } = props;
  const classes = useStyles();
  const relationText = relationTextBuilder(subject, object, gluon);

  const avatar = (
    <ListItemAvatar className={classes.avatarListItem}>
      <Avatar className={classes.avatar} style={{ width: 130, height: 130 }}>
        <img
          className="baryon-gluon-image"
          src={object.image_path}
          alt={object.name}
        />
      </Avatar>
    </ListItemAvatar>
  );
  return (
    <div className="baryon-gluon-body">
      <Card className={classes.card}>
        <ListItem>
          <Link to={`${ROUTES.GRAPH_BASE}${object.name}`}>{avatar}</Link>
          <ListItemText
            primary={relationText}
            secondary={util.period2str(gluon)}
          />
        </ListItem>
        {hasSecondLevel && object.gluons.length !== 0 && (
          <Fragment>
            <ListItem>
              <h3>Secondary Relationships</h3>
            </ListItem>
            <ListItem>
              <SecondGluons
                subject={object}
                objects={object.objects}
                gluons={object.gluons}
              />
            </ListItem>
          </Fragment>
        )}
      </Card>
    </div>
  );
};

Gluon.propTypes = {
  subject: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  object: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  gluon: PropTypes.shape({
    relation: PropTypes.string.isRequired
  }),
  hasSecondLevel: PropTypes.bool.isRequired
};
Gluon.defaultProps = {
  hasSecondLevel: false
};

export default Gluon;
