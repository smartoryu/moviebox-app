import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import Numeral from "numeral";
import { Modal, ModalBody, ModalFooter } from "reactstrap";

import { API_URL } from "../support/API_URL";

import Loading from "../components/Loading";

class BuyTicket extends Component {
  state = {
    dataMovie: {},
    schedule: 12,
    seats: 0,
    rows: 0,
    seatBooked: [],
    seatSelected: [],
    openModalCart: false,
    redirectHome: false,
    loading: true
  };

  componentDidMount() {
    this.onScheduleChange();
  }

  /*==============================================================/
  /                                                               /
  /                          SCHEDULE                             /
  /                                                               /
  ===============================================================*/
  onScheduleChange = () => {
    var studioId = this.props.location.state.studioId; // get Studio ID
    var movieId = this.props.location.state.id; // get Movie ID
    var schedule = this.props.location.state.schedule;
    // var schedule = this.state.schedule;

    Axios.get(`${API_URL}/studios/${studioId}`)
      .then(studio => {
        Axios.get(`${API_URL}/orders?movieId=${movieId}&schedule=${schedule}`)
          .then(orders => {
            var ordersArr = [];
            orders.data.forEach(order => {
              ordersArr.push(
                Axios.get(`${API_URL}/ordersDetails?orderId=${order.id}`)
              );
            });
            // console.log("studioID", studioId);
            // console.log("movieID", movieId);
            // console.log("studio", studio);

            var sumOrdersArr = [];
            Axios.all(ordersArr)
              .then(sumOrders => {
                sumOrders.forEach(orders => {
                  sumOrdersArr.push(...orders.data);
                });

                this.setState({
                  dataMovie: this.props.location.state,
                  seats: studio.data.totalSeat,
                  rows: studio.data.totalSeat / 20,
                  seatBooked: sumOrdersArr,
                  loading: false
                });
              })
              .catch(errSumOrders => {
                console.log(errSumOrders);
              });
          })
          .catch(errOrders => {
            console.log(errOrders);
          });
      })
      .catch(errStudio => {
        console.log(errStudio);
      });
  };

  onScheduleButtonClick = val => {
    this.setState({ schedule: val, seatSelected: [] });
    this.onScheduleChange();
  };

  renderScheduleButton = () => {
    return this.state.dataMovie.schedule.map((time, index) => {
      if (this.state.schedule === time) {
        return (
          <button key={index} disabled className="btn btn-primary mx-2">
            {time}.00
          </button>
        );
      }
      return (
        <button
          key={index}
          onClick={() => this.onScheduleButtonClick(time)}
          className="btn btn-outline-primary mx-2"
        >
          {time}.00
        </button>
      );
    });
  };

  /* ============================================================/
  /                                                              /
  /                            SEAT                              /
  /                                                              /
  ==============================================================*/
  onSelectSeat = (row, seat) => {
    var { seatSelected } = this.state;
    seatSelected.push({ row, seat });
    this.setState({ seatSelected });
  };

  onCancelSeat = (row, seat) => {
    var { seatSelected } = this.state;
    var rows = row;
    var seats = seat;
    var seatSelectedNew = [];
    for (let i = 0; i < seatSelected.length; i++) {
      if (seatSelected[i].row !== rows || seatSelected[i].seat !== seats) {
        seatSelectedNew.push(seatSelected[i]);
      }
    }
    this.setState({ seatSelected: seatSelectedNew });
  };

  onBookSeat = () => {
    var { userId } = this.props;
    var { movieId, seatSelected, schedule } = this.state;
    var totalPrice = seatSelected.length * 25000;
    var payment = false;
    var dataOrders = {
      userId,
      movieId,
      schedule,
      totalPrice,
      payment
    };

    // post dataOrders baru ke db.json sebagai orders
    Axios.post(`${API_URL}/orders`, dataOrders)
      .then(res => {
        var dataOrdersDetails = [];
        seatSelected.forEach(val => {
          console.log("ordersDetails", dataOrdersDetails);
          // push data selected seat(s) ke ordersDetails
          dataOrdersDetails.push({
            orderId: res.data.id,
            row: val.row,
            seat: val.seat
          });
        });

        var arrDataOrdersDetails = [];
        dataOrdersDetails.forEach(val => {
          console.log("arrOrdersDetails", arrDataOrdersDetails);
          // push array ordersDetails (berisi data selected seats) ke db.json
          arrDataOrdersDetails.push(
            Axios.post(`${API_URL}/ordersDetails`, val)
          );
        });

        // did ALL the Axios lalu memunculkan modal cart
        Axios.all(arrDataOrdersDetails)
          .then(res => {
            this.setState({ openModalCart: true });
          })
          .catch(err => {
            console.log("dataOrdersDetails", err);
          });
      })
      .catch(err => {
        console.log("dataOrders", err);
      });
  };

  renderSeatmap = () => {
    var rows = [];
    for (let row = 0; row < this.state.rows; row++) {
      rows.push([]); // push array kosong untuk membentuk baris kursi
      for (let seat = 0; seat < this.state.seats / this.state.rows; seat++) {
        rows[row].push(1); // push 1 untuk penanda posisi kursi dalam satu baris
      }
    }

    //===== penanda posisi kursi diganti 3 untuk booked seat
    for (let i = 0; i < this.state.seatBooked.length; i++) {
      rows[this.state.seatBooked[i].row][this.state.seatBooked[i]] = 3;
    }

    //===== penanda posisi kursi diganti 2 untuk selected seat
    for (let j = 0; j < this.state.seatSelected.length; j++) {
      rows[this.state.seatSelected[j].row][this.state.seatSelected[j].seat] = 2;
    }

    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var seatmap = rows.map((row, rowIndex) => {
      return (
        <div key={rowIndex}>
          {row.map((seat, seatIndex) => {
            if (seat === 3) {
              // styling untuk booked seat
              return (
                <button
                  key={seatIndex}
                  disabled
                  className="btn btn-danger rounded mt-2 mr-2 text-align-center"
                ></button>
              );
            } else if (seat === 2) {
              // styling untuk selected seat
              return (
                <button
                  key={seatIndex}
                  onClick={() => this.onCancelSeat(rowIndex, seatIndex)}
                  className="btn btn-warning rounded mt-2 mr-2 text-align-center"
                >
                  {alphabet[rowIndex] + (seatIndex + 1)}
                </button>
              );
            }
            // styling untuk default seat
            return (
              <button
                key={seatIndex}
                onClick={() => this.onSelectSeat(rowIndex, seatIndex)}
                className="btn btn-secondary rounded mt-2 mr-2 text-align-center"
              >
                {alphabet[rowIndex] + (seatIndex + 1)}
              </button>
            );
          })}
        </div>
      );
    });
    return seatmap;
  };

  /* ============================================================/
  /                                                              /
  /                            ETC                               /
  /                                                              /
  ==============================================================*/

  renderPriceQty = () => {
    var ticketQty = this.state.seatSelected.length;
    var ticketPrice = ticketQty * 25000;
    // this.setState({ totalPrice: ticketPrice });
    // this.setState({ ticketQty });

    return (
      <div>
        {this.state.seatSelected.length} x &nbsp;
        {`Rp ${Numeral(25000).format("0,0.00")}`} = &nbsp;
        {`Rp ${Numeral(ticketPrice).format("0,0.00")}`}
      </div>
    );
  };

  render() {
    if (this.props.location.state && this.props.AuthLogin) {
      if (this.state.redirectHome) {
        return <Redirect to={"/"} />;
      }
    }

    return (
      <center>
        <Modal isOpen={this.state.openModalCart}>
          <ModalBody>Item added to cart!</ModalBody>
          <ModalFooter>
            <button
              onClick={() => this.setState({ redirectHome: true })}
              className="btn btn-dark"
            >
              Ok
            </button>
          </ModalFooter>
        </Modal>

        {/*==================== CONTENT ====================*/}

        <div className="mt-1">
          {this.state.dataMovie.title}
          {this.state.loading ? <Loading /> : this.renderScheduleButton()}
        </div>

        <div className="mt-1">
          {this.state.seatSelected.length ? (
            <button onClick={this.onBookSeat} className="btn btn-success">
              Order Now!
            </button>
          ) : (
            <button disabled className="btn btn-success">
              Choose First!
            </button>
          )}
        </div>

        {this.renderPriceQty()}
        <div className="d-flex justify-content-center mt-4 mx-auto">
          <div>{this.state.loading ? <Loading /> : this.renderSeatmap()}</div>
        </div>
      </center>
    );
  }
}

const mapStateToProps = state => {
  return {
    AuthLogin: state.Auth.login,
    userId: state.Auth.id
  };
};

export default connect(mapStateToProps)(BuyTicket);