import { STORE_API } from "../actionType";

const INITIAL_STATE = {
  dataMovies: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STORE_API:
      console.log(action.payload);
      return { state: action.payload };
    default:
      return state;
  }
};
