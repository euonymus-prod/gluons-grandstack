import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { withAuthUser } from "../providers/session";
import Util from "../utils/common";
import SecondGluons from "./second-gluons";
import { LANGTYPE_ENG_LIKE, LANGTYPE_JP_LIKE } from "../constants/langtypes";
import * as ROUTES from "../constants/routes";
import SubmitGluonDelete from "./submit-gluon-delete";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
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
const useStyles = makeStyles(theme => ({
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
  mediaLink: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto"
    }
  },
  cover: {
    height: IMAGE_HEIGHT,
    [theme.breakpoints.up("sm")]: {
      width: IMAGE_WIDTH
    }
  },
  gluonHeader: {
    backgroundColor: "#d9b9b9",
    color: "white"
  },
  secondQuark: {
    flexDirection: "column",
    padding: 0,
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row"
    }
  },
  secondQuarkItems: {
    padding: "20px",
    alignItems: "start",
    width: "100%"
  },
  secondQuarkTitle: {
    paddingLeft: 0
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
}));

const relationTextBuilder = (subject, object) => {
  let glue_sentence_before_link = "";
  let glue_sentence_after_link = " ";
  const langType = util.isEnglish() ? LANGTYPE_ENG_LIKE : LANGTYPE_JP_LIKE;

  if (subject.id === object.gluon.active_id) {
    glue_sentence_before_link = subject.name;
    if (langType === LANGTYPE_ENG_LIKE) {
      glue_sentence_before_link += " " + object.gluon.relation;
    } else {
      glue_sentence_before_link += "は";
      glue_sentence_after_link += object.gluon.relation;
    }
    glue_sentence_before_link += " ";
    if (object.gluon.suffix) {
      glue_sentence_after_link += object.gluon.suffix;
    }
  } else if (subject.id === object.gluon.passive_id) {
    glue_sentence_before_link = "";
    if (langType === LANGTYPE_ENG_LIKE) {
      glue_sentence_after_link +=
        object.gluon.relation + " " + subject.name + " ";
    } else {
      glue_sentence_after_link += "は" + subject.name + object.gluon.relation;
    }
    glue_sentence_before_link += " ";
    if (object.gluon.suffix) {
      glue_sentence_after_link += object.gluon.suffix;
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
  const { authUser, subject, object, hasSecondLevel, isTop } = props;
  const classes = useStyles();
  const relationText = relationTextBuilder(subject, object);

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

  const user_id = authUser ? authUser.uid : null;

  const isLoggedIn = () => {
    return !!authUser;
  };

  const onClick = event => {
    props.history.push(`${ROUTES.GRAPH_BASE}${object.name}`);
  };
  return (
    <div className="baryon-gluon-body">
      <Card className={isTop ? classes.cardTop : classes.card}>
        <ListItem divider={true} className={classes.gluonHeader}>
          <ListItemText
            primary={relationText}
            secondary={util.period2str(object.gluon)}
          />
          {isLoggedIn() && (
            <Fragment>
              <Link to={`${ROUTES.EDIT_GLUON_BASE}${object.gluon.id}`}>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Link>
              <SubmitGluonDelete variables={{ id: object.gluon.id, user_id }} />
            </Fragment>
          )}
        </ListItem>
        <CardActionArea onClick={onClick}>
          <ListItem divider={true} className={classes.secondQuark}>
            <Link
              to={`${ROUTES.GRAPH_BASE}${object.name}`}
              className={classes.mediaLink}
            >
              {avatar}
            </Link>
            <List className={classes.secondQuarkItems}>
              <ListItem className={classes.secondQuarkTitle}>
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
        </CardActionArea>
        {hasSecondLevel && object.objects.length !== 0 && (
          <ListItem className={classes.secondGluons}>
            <SecondGluons
              subject={{ ...object, name: util.localedProp(object, "name") }}
              objects={object.objects}
            />
          </ListItem>
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
  // gluon: PropTypes.shape({
  //   relation: PropTypes.string.isRequired
  // }),
  hasSecondLevel: PropTypes.bool.isRequired,
  isTop: PropTypes.bool.isRequired
};
Gluon.defaultProps = {
  hasSecondLevel: false,
  isTop: false
};

export default withRouter(withAuthUser(Gluon));
