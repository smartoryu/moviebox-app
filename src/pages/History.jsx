import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { connect } from "react-redux";
import Axios from "axios";
import Numeral from "numeral";
import moment from "moment";

import { API_URL } from "../support/API_URL";

class History extends Component {
  state = {
    dataHistory: []
  };

  componentDidMount() {
    Axios.get(
      `${API_URL}/transactions?_expand=movie&userId=${this.props.UserId}&payment=true`
    )
      .then(res => {
        var dataHistory = res.data;
        console.log(res.data);
        var qtyArr = [];
        dataHistory.forEach(e => {
          qtyArr.push(
            Axios.get(`${API_URL}/transactions_details?orderId=${e.id}`)
          );
        });

        var qtyArrFinal = [];
        Axios.all(qtyArr)
          .then(res1 => {
            res1.forEach(val => {
              qtyArrFinal.push(val.data);
            });
            // console.log("qtyArrFinal", qtyArrFinal);

            var dataFinal = [];
            dataHistory.forEach((val, index) => {
              dataFinal.push({ ...val, qty: qtyArrFinal[index] });
            });
            this.setState({ dataHistory: dataFinal });
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

  renderHistory = () => {
    if (this.state.dataHistory.length === 0) {
      return (
        <Table.Row>
          <Table.Cell colspan="5" className="text-center">
            History Empty
          </Table.Cell>
        </Table.Row>
      );
    }

    return this.state.dataHistory.map((val, index) => {
      return (
        <tr key={index}>
          <td style={{ width: 100 }}>{index + 1}</td>
          <td style={{ width: 300 }}>{val.movie.title}</td>
          <td style={{ width: 100 }}>{val.date}</td>
          <td style={{ width: 100 }}>{`Rp ${Numeral(val.totalPrice).format(
            "0,0.-"
          )}`}</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div>
        <center>
          <h1 className="mt-4 mb-4">Transction History</h1>
          <Table
            celled
            structured
            className="text-center"
            style={{ width: "70%" }}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Movies</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Details</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.renderHistory()}</Table.Body>
          </Table>
        </center>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    UserId: state.Auth.id,
    role: state.Auth.role
  };
};

export default connect(mapStateToProps)(History);
