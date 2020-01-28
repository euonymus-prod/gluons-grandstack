import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Util from "../utils/common";
import SecondGluons from "./second-gluons";
import { LANGTYPE_ENG_LIKE, LANGTYPE_JP_LIKE } from "../constants/langtypes";
import * as ROUTES from "../constants/routes";
import SubmitQuarkDelete from "./submit-quark-delete";
// Material UI
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
// import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Typography from "@material-ui/core/Typography";
import no_image from "../assets/images/no_image.jpg";

const IMAGE_HEIGHT = "200px";
const IMAGE_WIDTH = "200px";

const util = new Util(false);
const useStyles = makeStyles({
  card: {
    margin: "0px",
    marginTop: "15px",
    display: "block"
  },
  cardTop: {
    margin: "0px",
    display: "block"
  },
  // avatarListItem: {
  //   width: IMAGE_WIDTH
  // },
  cover: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH
  },
  secondQuark: {
    padding: 0
  },
  secondQuarkItems: {
    padding: "20px",
    flexDirection: "column",
    alignItems: "start"
  },
  secondGluons: {
    height: 100,
    padding: 0
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
    <Fragment>
      {glue_sentence_before_link}
      <Link to={`${ROUTES.GRAPH_BASE}${object.name}`}>{object.name}</Link>
      {glue_sentence_after_link}
    </Fragment>
  );
};

const Gluon = props => {
  const { subject, object, gluon, hasSecondLevel, isTop } = props;
  const classes = useStyles();
  const relationText = relationTextBuilder(subject, object, gluon);

  const quarkImagePath = object.image_path ? object.image_path : no_image;
  const avatar = (
    <CardMedia
      className={classes.cover}
      image={quarkImagePath}
      title={object.name}
    />
  );

  // <ListItemAvatar className={classes.avatarListItem}>
  //   <Avatar className={classes.avatar} style={{ width: 130, height: 130 }}>
  //     <img
  //       className="baryon-gluon-image"
  //       src={object.image_path}
  //       alt={object.name}
  //     />
  //   </Avatar>
  // </ListItemAvatar>

  return (
    <div className="baryon-gluon-body">
      <Card className={isTop ? classes.cardTop : classes.card}>
        <ListItem divider={true}>
          <ListItemText
            primary={relationText}
            secondary={util.period2str(gluon)}
          />
          <Link to={`${ROUTES.EDIT_GLUON_BASE}${gluon.id}`}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
          {/* TODO */}
          <SubmitQuarkDelete
            name={"hoge"}
            variables={{}}
            withMenu={props.withMenu}
          />
        </ListItem>
        <ListItem divider={true} className={classes.secondQuark}>
          <Link to={`${ROUTES.GRAPH_BASE}${object.name}`}>{avatar}</Link>
          <List className={classes.secondQuarkItems}>
            <ListItem>
              <Typography variant="h5" component="span">
                {object.name}
              </Typography>
            </ListItem>
            <ListItemText
              primary={object.description}
              secondary={util.period2str(object)}
            />
          </List>
        </ListItem>
        {hasSecondLevel && object.gluons.length !== 0 && (
          <Fragment>
            <ListItem className={classes.secondGluons}>
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
  hasSecondLevel: PropTypes.bool.isRequired,
  isTop: PropTypes.bool.isRequired
};
Gluon.defaultProps = {
  hasSecondLevel: false,
  isTop: false
};

export default Gluon;
