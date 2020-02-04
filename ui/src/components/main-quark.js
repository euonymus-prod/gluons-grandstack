import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withAuthUser } from "../providers/session";
import { FormattedMessage } from "react-intl";
import Util from "../utils/common";
// Material UI
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
// import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import LinkIcon from "@material-ui/icons/Link";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import * as ROUTES from "../constants/routes";

const util = new Util(false);
const useStyles = makeStyles({
  media: {
    height: 300,
    backgroundPosition: "50% 0%"
  }
});

const MainQuark = props => {
  const classes = useStyles();

  const { subject } = props;
  if (!subject) {
    return <div className="baryon-subject baryon-grid">Not Found</div>;
  }
  const onLinkClick = (url, newWindow = false) => {
    if (newWindow) {
      window.open(url, "_blank");
    } else {
      props.history.push(url);
    }
  };

  const isLoggedIn = () => {
    return !!props.authUser;
  };

  return (
    <div className="baryon-subject baryon-grid">
      <Card className={classes.card}>
        {subject.image_path && (
          <CardMedia
            className={classes.media}
            image={subject.image_path}
            title={subject.name}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {subject.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {util.period2str(subject)}
            <br />
            {subject.description}
          </Typography>
        </CardContent>

        <CardActions>
          {subject.url && (
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => onLinkClick(subject.url, true)}
            >
              Web <LinkIcon />
            </Button>
          )}
          {subject.affiliate && (
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => onLinkClick(subject.affiliate, true)}
            >
              <FormattedMessage id="button_buy" defaultMessage={`Buy Now`} />{" "}
              <ShoppingCart />
            </Button>
          )}
        </CardActions>
        {isLoggedIn() && (
          <CardActions>
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() =>
                onLinkClick(`${ROUTES.ADD_GLUON_BASE}${subject.id}`)
              }
            >
              Add Gluon <AddCircleOutlineIcon />
            </Button>
          </CardActions>
        )}
      </Card>
    </div>
  );
};

MainQuark.propTypes = {
  subject: PropTypes.object.isRequired
};
export default withRouter(withAuthUser(MainQuark));
