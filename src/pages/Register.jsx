import React, { Component } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { API_URL } from "../support/API_URL";

class Register extends Component {
  state = {
    typePass1: "password",
    typePass2: "password",
    loading: false
  };

  onRegisterButton = () => {
    var username = this.refs.regUsername.value.toLowerCase();
    var password = this.refs.regPassword1.value;
    var password2 = this.refs.regPassword2.value;
    var role = "member";
    var newUser = { username, password, role };

    if (username === "" || password === "" || password2 === "") {
      Swal.fire({
        icon: "error",
        text: "All field must be filled!"
      });
    } else {
      Axios.get(`${API_URL}/users?username=${username}`)
        .then(userData => {
          if (userData.data.length === 0) {
            if (password === password2) {
              Axios.post(`${API_URL}/users`, newUser)
                .then(() => {
                  Swal.fire({
                    icon: "success",
                    text: "Registration successful"
                  });

                  this.props.history.push("login");
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              Swal.fire({
                icon: "error",
                text: "Password didn't match."
              });
            }
          } else {
            Swal.fire({
              icon: "error",
              text: "Username not available."
            });
          }
        })
        .catch(userDataError => {
          console.log(userDataError);
        });
    }
  };

  render() {
    if (this.props.AuthLogin) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <div style={{ height: "70vh" }}>
          <div className="container" style={{ width: "30%" }}>
            <h3>Registration</h3>

            <div className="mb-3">
              <label>Username</label>
              <input
                ref="regUsername"
                type="text"
                className="form-control-plaintext"
                placeholder="Enter username"
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                ref="regPassword1"
                type={`${this.state.typePass1}`}
                className="form-control-plaintext"
                placeholder="Enter password..."
              />
            </div>

            <div className="mb-3">
              <label>Re-enter Password</label>
              <input
                ref="regPassword2"
                type={`${this.state.typePass2}`}
                className="form-control-plaintext"
                placeholder="Re-enter password..."
              />
            </div>

            <div className="mx-auto">
              <button
                onClick={this.onRegisterButton}
                className="btn btn-dark mt-4"
              >
                Submit
              </button>
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

export default connect(mapStateToProps)(Register);
