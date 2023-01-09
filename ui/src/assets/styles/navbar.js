// Material UI
import { alpha, makeStyles } from "@material-ui/core/styles";

const navbarColor = "#f8f8f8";
export const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: navbarColor
  },
  logo: {
    width: "60px"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  // title: {
  //   display: "none",
  //   [theme.breakpoints.up("sm")]: {
  //     display: "block"
  //   }
  // },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 1)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777777"
  },
  // inputRoot: {
  //   color: "inherit"
  // },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
}));
