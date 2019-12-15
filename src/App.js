import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Axios from "axios";
import { connect } from "react-redux";
import { LoginSuccessAction } from "./redux/actions";

import "./App.css";

import Header from "./components/Header";
import Loading from "./components/Loading";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import MovieDetail from "./pages/MovieDetail";
import BuyTicket from "./pages/BuyTicket";

import { API_URL } from "./support/API_URL";

class App extends Component {
  state = { loading: true };

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

  render() {
    // console.log(this.props.AuthLogin);
    if (this.state.loading) {
      return (
        <div>
          <Loading />
        </div>
      );
    } else {
      return (
        <div>
          <Header />
          <Switch>
            <Route exact path={"/"} component={Home} />
            <Route exact path={"/admin"} component={Admin} />
            <Route exact path={"/login"} component={Login} />
            <Route exact path={"/movie_detail/:id"} component={MovieDetail} />
            <Route exact path={"/buy_ticket"} component={BuyTicket} />
          </Switch>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    AuthLogin: state.Auth.login
  };
};

export default connect(mapStateToProps, { LoginSuccessAction })(App);
