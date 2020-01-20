import * as ACTIONS from "../constants/actions";

export const setCurrentQuark = quark => {
  return {
    type: ACTIONS.SET_CURRENT_QUARK,
    payload: { quark }
  };
};
