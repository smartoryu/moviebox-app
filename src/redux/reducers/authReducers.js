const INITIAL_STATE = {
  id: "",
  username: "",
  password: "",
  role: "",
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
      return { ...state, ...action.payload, login: false };
    default:
      return state;
  }
};
