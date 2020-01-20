import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import current_quark from "../reducers/current_quark";

const reducer = combineReducers({
  current_quark
});
const store = createStore(reducer, applyMiddleware(thunk));
export default store;
