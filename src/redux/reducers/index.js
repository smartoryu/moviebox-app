import { combineReducers } from "redux";
// import dataMoviesReducers from "./dataMoviesReducer";
import AuthReducers from "./authReducers";

export default combineReducers({
  // dataMovies: dataMoviesReducers,
  Auth: AuthReducers
});
