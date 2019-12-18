import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Numeral from "numeral";
import { Button } from "semantic-ui-react";
import { Table, Modal, ModalBody, ModalFooter } from "reactstrap";

import { API_URL } from "../support/API_URL";

import NotFound from "./NotFound";

class Cart extends Component {
  state = {
    dataCart: null,
    detailSeat: null,
    modalDetail: false,
    dataDelete: {},
    modalDelete: false,
    priceCheckout: 0,
    modalCheckout: false
  };

  componentDidMount() {
    Axios.get(
      `${API_URL}/orders?_expand=movie&userId=${this.props.UserId}&payment=false`
    )
      .then(res => {
        var dataCart = res.data;

        var qtyArr = [];
        dataCart.forEach(e => {
          qtyArr.push(Axios.get(`${API_URL}/ordersDetails?orderId=${e.id}`));
        });

        var qtyArrFinal = [];
        Axios.all(qtyArr)
          .then(res1 => {
            res1.forEach(val => {
              qtyArrFinal.push(val.data);
            });
            // console.log("qtyArrFinal", qtyArrFinal);

            var dataFinal = [];
            dataCart.forEach((val, index) => {
              dataFinal.push({ ...val, qty: qtyArrFinal[index] });
            });
            this.setState({ dataCart: dataFinal });
            // console.log("dataFinal", dataFinal);
          })
          .catch(err1 => {
            console.log(err1);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderCart = () => {
    if (this.state.dataCart !== null) {
      if (this.state.dataCart.length === 0) {
        return (
          <tr>
            <td></td>
            <td>Cart Empty</td>
          </tr>
        );
      }

      return this.state.dataCart.map((val, index) => {
        return (
          <tr key={index}>
            <td style={{ width: 100 }}>{index + 1}</td>
            <td style={{ width: 300 }}>{val.movie.title}</td>
            <td style={{ width: 100 }}>{val.schedule}</td>
            <td style={{ width: 100 }}>{val.qty.length}</td>
            <td style={{ width: 100 }}>{`Rp ${Numeral(val.totalPrice).format(
              "0,0.-"
            )}`}</td>
            <td style={{ width: 300 }}>
              <Button
                animated="vertical"
                color="blue"
                onClick={() => this.btnDetail(index)}
              >
                <Button.Content visible>Details</Button.Content>
                <Button.Content hidden>Click Me</Button.Content>
              </Button>
              <Button
                animated="vertical"
                color="red"
                onClick={() =>
                  this.setState({ modalDelete: true, dataDelete: val })
                }
              >
                <Button.Content visible>Delete</Button.Content>
                <Button.Content hidden>Click Me</Button.Content>
              </Button>
            </td>
          </tr>
        );
      });
    }
  };

  btnDetail = index => {
    this.setState({ modalDetail: true });
    var id = this.state.dataCart[index].id;
    Axios.get(`${API_URL}/ordersDetails?orderId=${id}`)
      .then(res => {
        var dataMovie = res.data;
        var seat = [];
        var row = [];
        dataMovie.map(val => {
          seat.push(val.seat);
          row.push(val.row);
        });

        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var position = [];
        for (let i = 0; i < seat.length; i++) {
          for (let j = 0; j < alphabet.length; j++) {
            if (row[i] === j) {
              position.push(alphabet[j] + (seat[i] + 1));
            }
          }
        }
        this.setState({ detailSeat: position });
      })
      .catch(err => {
        console.log(err);
      });
  };

  btnDelete = index => {
    Axios.delete(`${API_URL}/orders/${this.state.dataDelete.id}`)
      .then(() => {
        Axios.delete(
          `${API_URL}/ordersDetails?orderId=${this.state.dataDelete.id}`
        )
          .then(() => {})
          .catch(err => {
            console.log(err);
          });

        this.componentDidMount();
        this.setState({ modalDelete: false, dataDelete: {} });
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      });
  };

  totalCheckout = () => {
    var reservation = this.state.dataCart;
    var totalPrice = 0;
    for (let i = 0; i < reservation.length; i++) {
      totalPrice += reservation[i].totalPrice;
    }
    // return this.setState({ priceCheckout: totalPrice });
    return totalPrice;
    // console.log(totalPrice);
  };

  payCheckout = () => {
    var reservation = this.state.dataCart;
    for (let i = 0; i < reservation.length; i++) {
      var dataCart = {
        userId: reservation[i].userId,
        movieId: reservation[i].movieId,
        schedule: reservation[i].schedule,
        totalPrice: reservation[i].totalPrice,
        payment: true,
        id: reservation[i].id
      };
      Axios.put(`${API_URL}/orders/${dataCart.id}`, dataCart)
        .then(res => {
          // console.log(res.dataCart);
          Axios.post(`${API_URL}/transactions`, res.data)
            .then(() => {
              this.componentDidMount();
            })
            .catch(errPost => {
              console.log(errPost);
            });
        })
        .catch(errPut => {
          console.log(errPut);
        });
    }
    this.setState({ modalCheckout: false });
  };

  render() {
    if (this.props.AuthLogin === false) {
      return <Redirect to={"/"} />;
    }

    if (this.props.UserId && this.props.Role === "member") {
      return (
        <div>
          <Modal /////// MODAL DETAIL
            isOpen={this.state.modalDetail}
            toggle={() => this.setState({ modalDetail: false })}
          >
            <ModalBody className="text-center">
              <Table>
                <thead>
                  <tr>
                    <th>Total</th>
                    <th>Seat</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.detailSeat ? (
                    <tr>
                      <th>
                        {this.state.detailSeat.length} &nbsp;
                        {this.state.detailSeat.length > 1
                          ? "tickets"
                          : "ticket"}
                      </th>
                      <th>
                        {this.state.detailSeat.map(val => {
                          return val + " ";
                        })}
                      </th>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
              <br />
              <button
                className="btn btn-outline-success"
                onClick={() => this.setState({ modalDetail: false })}
              >
                Close
              </button>
            </ModalBody>
          </Modal>

          <Modal /////// MODAL DELETE
            isOpen={this.state.modalDelete}
            toggle={() => this.setState({ modalDelete: false })}
          >
            <ModalBody className="text-center">
              Are you sure deleting order no. {this.state.dataDelete.id}?
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Total</th>
                    <th>Seat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.btnDelete} color="red">
                Delete
              </Button>
              <Button
                onClick={() =>
                  this.setState({ modalDelete: false, dataDelete: {} })
                }
                color="blue"
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.modalCheckout}
            toggle={() => this.setState({ modalCheckout: false })}
            centered
          >
            {this.state.modalCheckout ? (
              <ModalBody>
                <Table className="text-center">
                  <thead>
                    <tr>
                      <th>Total price you should pay:</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{`Rp ${Numeral(this.totalCheckout()).format(
                        "0,0.00"
                      )}`}</td>
                    </tr>
                  </tbody>
                </Table>
              </ModalBody>
            ) : null}
            <ModalFooter>
              <button
                onClick={this.payCheckout}
                className="btn btn-dark mt-2 mb-2 mx-auto"
              >
                Pay now
              </button>
            </ModalFooter>
          </Modal>

          <center>
            <Table className="text-center" style={{ width: 800 }}>
              <thead>
                <tr>
                  <th style={{ width: 100 }}>#</th>
                  <th style={{ width: 200 }}>Title</th>
                  <th style={{ width: 100 }}>Schedule</th>
                  <th style={{ width: 100 }}>Qty</th>
                  <th style={{ width: 200 }}>Price</th>
                  <th style={{ width: 100 }}></th>
                </tr>
              </thead>
              <tbody>{this.renderCart()}</tbody>
            </Table>
            <button
              onClick={() => this.setState({ modalCheckout: true })}
              className="btn btn-outline-dark"
            >
              Checkout
            </button>
          </center>
        </div>
      );
    }

    return <NotFound />;
  }
}

const mapStateToProps = state => {
  return {
    AuthLogin: state.Auth.login,
    UserId: state.Auth.id,
    Role: state.Auth.role
  };
};

export default connect(mapStateToProps)(Cart);
