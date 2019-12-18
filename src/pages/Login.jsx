import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
// import Axios from "axios";
// import { API_URL } from "../support/API_URL";
import { connect } from "react-redux";
import { LoginSuccessAction, LoginThunk, login_error } from "../redux/actions";
import Loader from "react-loader-spinner";

class Login extends Component {
  // state = {
  //   login: false,
  //   error: "",
  //   loading: false
  // };

  onLoginClick = () => {
    var username = this.refs.username.value;
    var password = this.refs.password.value;
    this.props.LoginThunk(username, password);

    // Axios.get(`${API_URL}/users?username=${username}&password=${password}`)
    //   .then(res => {
    //     if (res.data.length) {
    //       this.setState({ login: true });
    //       this.props.LoginSuccessAction(res.data[0]);
    //       console.log(res.data);
    //       console.log(res.data[0]);
    //     } else {
    //       this.setState({ error: "Wrong username/password" });
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  };

  render() {
    console.log(this.props.AuthLogin);
    if (this.props.AuthLogin) {
      return <Redirect to="" />;
    }
    return (
      <div>
        <div className="d-flex justify-content-center">
          <div
            className="rounded p-2"
            style={{ width: "500px", border: "1px solid black" }}
          >
            <center>
              <h5>Login</h5>
            </center>
            <div className="p-2" style={{ borderBottom: "1px solid black" }}>
              <input
                type="text"
                ref="username"
                placeholder="Username"
                className="username"
                style={{
                  border: "1px solid transparent",
                  width: "100%",
                  fontSize: "20px"
                }}
              />
            </div>
            <div className="p-1" style={{ borderBottom: "1px solid black" }}>
              <input
                type="password"
                ref="password"
                placeholder="Password"
                className="username"
                style={{
                  border: "1px solid transparent",
                  width: "100%",
                  fontSize: "20px"
                }}
              />
            </div>

            {this.props.Auth.error === "" ? null : (
              <div className="alert alert-danger mt-2">
                {this.props.Auth.error}
                <span
                  onClick={this.props.login_error}
                  className="float-right alert-x"
                >
                  x
                </span>
              </div>
            )}

            <div className="mt-3">
              {this.props.Auth.loading ? (
                <Loader type="Puff" color="#00BFFF" height={100} width={100} />
              ) : (
                <button onClick={this.onLoginClick} className="btn-primary">
                  Login
                </button>
              )}
            </div>
            <div className="mt-4">
              Don't have account yet? <Link to="">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    AuthLogin: state.Auth.login,
    Auth: state.Auth
  };
};

export default connect(mapStateToProps, {
  LoginSuccessAction,
  LoginThunk,
  login_error
})(Login);
