import * as ACTIONS from "../constants/actions";

const initState = null;
export default (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_QUARK:
      return action.payload.quark;
    default:
      return false;
  }
};
