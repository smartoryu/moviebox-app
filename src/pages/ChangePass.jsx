import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Form } from "semantic-ui-react";
import { ResetPassAction } from "../redux/actions";

import { API_URL } from "../support/API_URL";

class ChangePass extends Component {
  state = {
    redirectHome: false
  };

  changePassClick = () => {
    var username = this.props.Username;
    var role = this.props.Role;
    var oldPass = this.refs.oldPass.value;
    var newPass = this.refs.newPass.value;
    var confirmPass = this.refs.confirmPass.value;
    var updatePass = {
      username,
      password: confirmPass,
      role
    };
    console.log("updatedPass", updatePass);

    if (oldPass === "" || newPass === "" || confirmPass === "") {
      Swal.fire({
        icon: "error",
        text: "Password should be filled"
      });
    } else if (oldPass !== this.props.Password) {
      Swal.fire({
        icon: "error",
        text: "Wrong old password"
      });
    } else if (oldPass === newPass) {
      Swal.fire({
        icon: "error",
        text: "New password should be different"
      });
    } else if (newPass !== confirmPass) {
      Swal.fire({
        icon: "error",
        text: "New password didn't match"
      });
    } else {
      Axios.put(`${API_URL}/users/${this.props.UserId}`, updatePass)
        .then(result => {
          Swal.fire({
            title: "Are you sure changing the password?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes"
          }).then(res => {
            if (res.value) {
              this.props.ResetPassAction(result.data);
              this.setState({ redirectHome: true });
              Swal.fire({
                title: "Your password has been updated!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    if (this.state.redirectHome || this.props.AuthLogin === false) {
      return <Redirect to="/" />;
    }

    return (
      <div className="mx-auto mt-5" style={{ width: "40%" }}>
        <div className="text-center">
          <h1>Change Password</h1>
        </div>

        <Form className="mt-5">
          <Form.Field>
            <label>Username</label>
            <input disabled ref="username" defaultValue={this.props.Username} />
          </Form.Field>
          <Form.Field>
            <label>Old Password</label>
            <input ref="oldPass" type="password" placeholder="" />
          </Form.Field>
          <Form.Field>
            <label>New Password</label>
            <input ref="newPass" type="password" placeholder="" />
          </Form.Field>
          <Form.Field>
            <label>Re-enter New Password</label>
            <input ref="confirmPass" type="password" placeholder="" />
          </Form.Field>
          <Button fluid type="submit" onClick={this.changePassClick}>
            Change Password
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    AuthLogin: state.Auth.login,
    UserId: state.Auth.id,
    Username: state.Auth.username,
    Password: state.Auth.password,
    Role: state.Auth.role
  };
};

export default connect(mapStateToProps, { ResetPassAction })(ChangePass);
