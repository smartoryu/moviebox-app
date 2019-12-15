import Axios from "axios";
import { API_URL } from "../../support/API_URL";

export const LoginSuccessAction = dataUser => {
  return {
    type: "LOGIN_SUCCESS",
    payload: dataUser
  };
};

export const LogoutSuccessAction = () => {
  return {
    type: "LOGOUT_SUCCESS",
    payload: { id: "", username: "", password: "", role: "" }
  };
};

export const LoginThunk = (username, password) => {
  return dispatch => {
    dispatch({ type: "LOGIN_LOADING" });
    Axios.get(`${API_URL}/users?username=${username}&password=${password}`)
      .then(res => {
        if (res.data.length) {
          localStorage.setItem("user_login", res.data[0].id);
          dispatch(LoginSuccessAction(res.data[0]));
        } else {
          dispatch({ type: "LOGIN_ERROR", payload: "Wrong password!" });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: "LOGIN_ERROR", payload: "Server error!" });
      });
  };
};

export const login_error = () => {
  return dispatch => {
    dispatch({ type: "LOGIN_ERROR", payload: "" });
  };
};
