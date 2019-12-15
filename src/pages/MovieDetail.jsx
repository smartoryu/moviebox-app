import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import { Modal, ModalBody, ModalFooter } from "reactstrap";

import { API_URL } from "../support/API_URL";

class MovieDetail extends Component {
  state = {
    dataMovieDetail: {},
    isOpenTrailer: false,
    isLogin: false,
    toLoginPage: false,
    authBuyTicket: false
  };

  async componentDidMount() {
    console.log(this.props);
    try {
      var { data } = await Axios.get(
        `${API_URL}/movies/${this.props.match.params.id}`
      );
      this.setState({ dataMovieDetail: data });
    } catch (err) {
      console.log(err);
      return `Caught an error: ${err}`;
    }
  }

  onBuyTicket = () => {
    this.props.AuthLogin
      ? this.setState({ authBuyTicket: true })
      : this.setState({ isLogin: true });
  };

  modalTrailer = () => {
    return (
      <Modal>
        <ModalBody></ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    );
  };

  modalBuyTicket = () => {
    return (
      <Modal
        isOpen={this.state.isLogin}
        centered
        toggle={() => this.setState({ isLogin: false })}
      >
        <ModalBody>You need to login first.</ModalBody>
        <ModalFooter>
          <button
            onClick={() => this.setState({ toLoginPage: true })}
            className="btn btn-primary"
          >
            Login
          </button>
        </ModalFooter>
      </Modal>
    );
  };

  render() {
    if (this.state.toLoginPage) {
      return <Redirect to={"/login"} />;
    } // bawa ke login page kalau beli tiket tp belum login

    if (this.state.authBuyTicket) {
      return (
        <Redirect
          to={{ pathname: "/buy_ticket", state: this.state.dataMovieDetail }}
        />
      );
    } // bawa ke page buy_ticket dgn membawa detail film yg dipilih

    return (
      <div>
        {this.modalTrailer()}
        {this.modalBuyTicket()}
        <div className="row p-3 mx-3 my-4">
          <div className="col-md-4">
            <img
              src={this.state.dataMovieDetail.image}
              height="400"
              alt="film"
            />
            <div className="mt-3" style={{ fontSize: "30px" }}>
              {this.state.dataMovieDetail.title}
            </div>
          </div>
          <div className="col-md-2">
            <div className="mt-1 d-flex">
              <span className="mr-auto">Title</span>
              <span className="ml-auto">:</span>
            </div>
            <div className="mt-1 d-flex">
              <span className="mr-auto">Synopsis</span>
              <span className="ml-auto">:</span>
            </div>
          </div>
          <div className="col-md-5">
            <div className="mt-1">{this.state.dataMovieDetail.title}</div>
            <div className="mt-1">{this.state.dataMovieDetail.synopsis}</div>
            <div className="mt-3">
              <button
                className="mr-3 btn btn-primary"
                onClick={this.onBuyTicket}
              >
                Buy ticket(s)!
              </button>
              <button
                className=" btn btn-outline-warning"
                onClick={() => this.setState({ isOpenTrailer: true })}
              >
                Trailer
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
    AuthLogin: state.Auth.login
  };
};

export default connect(mapStateToProps)(MovieDetail);
