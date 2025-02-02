const INITIAL_STATE = {
  id: "",
  username: "",
  password: "",
  role: "",
  cartCount: 0,
  login: false,
  loading: false,
  error: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        ...action.payload,
        login: true,
        loading: false,
        error: ""
      };
    case "LOGIN_LOADING":
      return { ...state, loading: true, error: "" };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT_SUCCESS":
      return INITIAL_STATE;
    case "ADD_CART":
      return { ...state, cartCount: action.payload };
    case "RESET_PASS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
