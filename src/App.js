import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Axios from "axios";
import { connect } from "react-redux";
import { LoginSuccessAction, AddCartAction } from "./redux/actions";

import "./App.css";

import Header from "./components/Header";
import Loading from "./components/Loading";
import Home from "./pages/Home";
import ManageAdmin from "./pages/ManageAdmin";
import ManageStudio from "./pages/ManageStudio";
import Login from "./pages/Login";
import MovieDetail from "./pages/MovieDetail";
import BuyTicket from "./pages/BuyTicket";
import Register from "./pages/Register";
import ChangePass from "./pages/ChangePass";
import Cart from "./pages/Cart";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

import { API_URL } from "./support/API_URL";

class App extends Component {
  state = {
    loading: true
  };

  async componentDidMount() {
    try {
      var id = localStorage.getItem("user_login");
      if (id) {
        var { data } = await Axios.get(`${API_URL}/users/${id}`);
        this.props.LoginSuccessAction(data);
      }
    } catch (err) {
      console.log(err);
      return `Caught an error: ${err}`;
    } finally {
      this.setState({ loading: false });
    }
  }
  // console.log(this.props.AuthLogin);

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    if (this.props.UserId) {
      Axios.get(`${API_URL}/orders?userId=${this.props.UserId}`)
        .then(res => {
          Axios.get(
            `${API_URL}/transactions?userId=${this.props.UserId}&payment=true`
          )
            .then(res2 => {
              this.props.AddCartAction(res.data.length - res2.data.length);
            })
            .catch(err2 => {
              console.log(err2);
            });
        })
        .catch(err => {
          console.log(err);
        });
    }

    return (
      <div>
        <Header />
        <Switch>
          <Route exact path={"/"} component={Home} />
          <Route exact path={"/admin"} component={ManageAdmin} />
          <Route exact path={"/studio"} component={ManageStudio} />
          <Route exact path={"/login"} component={Login} />
          <Route exact path={"/movie_detail/:id"} component={MovieDetail} />
          <Route exact path={"/buy_ticket"} component={BuyTicket} />
          <Route exact path={"/register"} component={Register} />
          <Route exact path={"/change_password"} component={ChangePass} />
          <Route exact path={"/cart"} component={Cart} />
          <Route exact path={"/history"} component={History} />
          <Route exact path={"/notfound"} component={NotFound} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    AuthLogin: state.Auth.login,
    UserId: state.Auth.id
  };
};

export default connect(mapStateToProps, { LoginSuccessAction, AddCartAction })(
  App
);
