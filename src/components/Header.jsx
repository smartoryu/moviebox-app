import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LogoutSuccessAction } from "../redux/actions";
import Swal from "sweetalert2";
import { FaShoppingCart } from "react-icons/fa";
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
    onMouseEnter: false,
    redirectHome: false
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
                window.location.reload(false);
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
            {Username === "" ? (
              <Nav className="ml-auto" navbar>
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
                    <DropdownItem href={"/register"}>Register</DropdownItem>
                    <DropdownItem divider />
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem>
                  <NavLink href="https://github.com/smartoryu/moviebox-app">
                    GitHub
                  </NavLink>
                </NavItem>
              </Nav>
            ) : Role === "admin" ? (
              <Nav className="ml-auto" navbar>
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
                    {Username} {/* siapa yang sedang login */}
                  </DropdownToggle>
                  <DropdownMenu
                    onMouseLeave={() => this.setState({ onMouseEnter: false })}
                    right
                  >
                    <DropdownItem href="/admin/">Manage Movies</DropdownItem>
                    <DropdownItem href="/studio">Manage Studios</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.userLogout}>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem>
                  <NavLink href="https://github.com/smartoryu/moviebox-app">
                    GitHub
                  </NavLink>
                </NavItem>
              </Nav>
            ) : (
              <Nav className="ml-auto" navbar>
                {/* <NavItem>
                  <NavLink href="">History</NavLink>
                </NavItem> */}
                <NavItem>
                  <NavLink href="/cart">
                    {this.props.CartCount}
                    <FaShoppingCart
                      className="ml-1"
                      style={{ fontSize: "25px", cursor: "pointer" }}
                    />
                  </NavLink>
                </NavItem>
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
                    {Username} {/* siapa yang sedang login */}
                  </DropdownToggle>
                  <DropdownMenu
                    onMouseLeave={() => this.setState({ onMouseEnter: false })}
                    right
                  >
                    <DropdownItem href="/history">History</DropdownItem>
                    <DropdownItem href="/change_password/">
                      Change Password
                    </DropdownItem>
                    <DropdownItem disabled>You're going nowhere</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.userLogout}>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem>
                  <NavLink href="https://github.com/smartoryu/moviebox-app">
                    GitHub
                  </NavLink>
                </NavItem>
              </Nav>
            )}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    Username: state.Auth.username,
    Role: state.Auth.role,
    CartCount: state.Auth.cartCount
  };
};

export default connect(mapStateToProps, { LogoutSuccessAction })(Header);
