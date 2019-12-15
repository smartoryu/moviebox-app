import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LogoutSuccessAction } from "../redux/actions";
import Swal from "sweetalert2";
// import { FaOpencart } from "react-icons/fa";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class Header extends Component {
  state = {
    setIsOpen: false,
    onMouseEnter: false
  };

  userLogout = () => {
    // localStorage.removeItem("user_login");
    // this.props.LogoutSuccessAction();

    Swal.fire({
      title: "Are you sure logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout!"
    }).then(result => {
      if (result.value) {
        // let timerInterval;
        Swal.fire({
          title: "Logging out!",
          timer: 1800,
          allowOutsideClick: false,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading();
          }
        })
          .then(result => {
            if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.timer
            ) {
              console.log("user logged out"); // eslint-disable-line
            }
          })
          .then(() => {
            Swal.fire({
              title: "Logged out",
              icon: "success",
              showConfirmButton: false,
              timer: 1000
            })
              .then(() => {
                localStorage.removeItem("user_login");
                this.props.LogoutSuccessAction();
              })
              .then(() => {
                return <Redirect to={"/"} />;
              });
          });
      }
    });
  };

  render() {
    const { Username, Role } = this.props;

    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">moviebox</NavbarBrand>
          <NavbarToggler onClick={() => this.setState({ setIsOpen: true })} />
          <Collapse isOpen={this.state.setIsOpen} navbar>
            <Nav className="ml-auto" navbar>
              {Username && Role === "admin" ? (
                <NavItem>
                  <NavLink href="/admin/">Admin</NavLink>
                </NavItem>
              ) : null}
              <NavItem>
                <NavLink href="">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/smartoryu/moviebox-app">
                  GitHub
                </NavLink>
              </NavItem>

              {Username === "" ? (
                <UncontrolledDropdown
                  isOpen={this.state.onMouseEnter}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    onMouseEnter={() => this.setState({ onMouseEnter: true })}
                    nav
                    caret
                  >
                    Account
                  </DropdownToggle>
                  <DropdownMenu
                    onMouseLeave={() => this.setState({ onMouseEnter: false })}
                    right
                  >
                    <DropdownItem href={"/login"}>Login</DropdownItem>
                    <DropdownItem disabled>Register</DropdownItem>
                    <DropdownItem divider />
                  </DropdownMenu>
                </UncontrolledDropdown>
              ) : (
                <UncontrolledDropdown
                  isOpen={this.state.onMouseEnter}
                  nav
                  inNavbar
                >
                  <DropdownToggle
                    onMouseEnter={() => this.setState({ onMouseEnter: true })}
                    nav
                    caret
                  >
                    {/* siapa yang sedang login */}
                    {Username}
                  </DropdownToggle>
                  <DropdownMenu
                    onMouseLeave={() => this.setState({ onMouseEnter: false })}
                    right
                  >
                    <DropdownItem disabled>Option 1</DropdownItem>
                    <DropdownItem disabled>Option 2</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.userLogout}>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    Username: state.Auth.username,
    Role: state.Auth.role
  };
};

export default connect(mapStateToProps, { LogoutSuccessAction })(Header);
