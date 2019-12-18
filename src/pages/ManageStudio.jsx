import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Table } from "reactstrap";
import Swal from "sweetalert2";

import { API_URL } from "../support/API_URL";
import NotFound from "./NotFound";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class ManageStudio extends Component {
  state = {
    reload: 0,
    dataStudios: [],
    studioId: -1,
    modalAdd: false,
    indexEdit: -1,
    modalEdit: false,
    indexDelete: -1,
    modalDelete: false
  };

  async componentDidMount() {
    try {
      var studios = await Axios.get(`${API_URL}/studios`);
      this.setState({ dataStudios: studios.data });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidUpdate() {}

  /* ============================================================/
  /                                                              /
  /                           BUTTON                             /
  /                                                              /
  ==============================================================*/

  btnAdd = () => {
    const ref = this.refs;
    var newName = ref.add_name.value;
    var newTotalSeat = ref.add_totalSeat.value;

    var newObj = { name: newName, totalSeat: newTotalSeat };

    if ({ ...(newObj !== "") }) {
      Axios.post(`${API_URL}/studios/`, newObj)
        .then(() => {
          Axios.get(`${API_URL}/studios`)
            .then(res => {
              Swal.fire({
                icon: "success",
                title: "New Studio Added",
                showConfirmButton: false,
                allowOutsideClick: false,
                timerProgressBar: true,
                timer: 1000
              }).then(() => {
                this.setState({ dataStudio: res.data, modalAdd: false });
                window.location.reload(false);
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Ooops...",
        text: "Data incomplete!"
      });
    }
  };

  btnEdit = index => {
    var editStudio = this.state.dataStudios;
    this.setState({
      modalEdit: true,
      indexEdit: index,
      studioId: editStudio[index].id
    });
  };

  btnDelete = index => {
    Swal.fire({
      title: `Are you sure deleting ${this.state.dataStudios[index].name}?`,
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then(res => {
      if (res.value) {
        var dataStudio = this.state.dataStudios;
        this.setState({ studioId: dataStudio[index]["id"] });
        console.log("Deleted ID Movie", dataStudio[index]["id"]);
        dataStudio.splice(index, 1);
        this.setState({ dataStudio });
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          showConfirmButton: false,
          allowOutsideClick: false,
          timerProgressBar: true,
          timer: 1000
        })
          .then(() => {
            Axios.delete(`${API_URL}/studios/${this.state.studioId}`);
          })
          .catch(err => {
            console.log(err);
          });
      } else if (res.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "error",
          title: "Cancelled",
          showConfirmButton: false,
          allowOutsideClick: false,
          timerProgressBar: true,
          timer: 1000
        });
      }
    });
  };

  btnSave = () => {
    const ref = this.refs;
    var editName = ref.edit_name.value;
    var editTotalSeat = ref.edit_totalSeat.value;
    var id = this.state.studioId;

    var newObj = { name: editName, totalSeat: editTotalSeat };

    if ({ ...(newObj !== "") }) {
      Axios.put(`${API_URL}/studios/${id}`, newObj)
        .then(() => {
          Axios.get(`${API_URL}/studios`)
            .then(res => {
              Swal.fire({
                icon: "success",
                title: "Studio updated",
                showConfirmButton: false,
                allowOutsideClick: false,
                timerProgressBar: true,
                timer: 1000
              }).then(() => {
                this.setState({ dataStudio: res.data, modalEdit: false });
                window.location.reload(false);
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Ooops...",
        text: "Data incomplete!"
      });
    }
  };

  /* ============================================================/
  /                                                              /
  /                            ....                              /
  /                                                              /
  ==============================================================*/
  renderTable = () => {
    return this.state.dataStudios.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{val.name}</td>
          <td>{val.totalSeat}</td>
          <td>
            <button
              onClick={() => this.btnEdit(index)}
              className="btn btn-primary px-4 mr-3"
            >
              Edit
            </button>
            <button
              onClick={() => this.btnDelete(index)}
              className="btn btn-danger px-3"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  render() {
    const { dataStudios, indexEdit, modalEdit, modalAdd } = this.state;
    const { AuthLogin, AuthRole } = this.props;

    // ========================================

    if (AuthLogin && AuthRole === "admin") {
      return (
        <div>
          {indexEdit === -1 ? null : (
            //////// MODAL EDIT STUDIO
            <Modal
              size="md"
              isOpen={modalEdit}
              toggle={() => this.setState({ modalEdit: false })}
            >
              <ModalHeader>
                Edit Studio {dataStudios[indexEdit.title]}
              </ModalHeader>
              <ModalBody>
                <span>Studio Name:</span>
                <input
                  type="text"
                  defaultValue={dataStudios[indexEdit].name}
                  ref="edit_name"
                  className="form-control mb-2"
                />
                <span>Total Seat:</span>
                <input
                  type="number"
                  defaultValue={dataStudios[indexEdit].totalSeat}
                  ref="edit_totalSeat"
                  className="form-control mb-2"
                />
              </ModalBody>
              <ModalFooter>
                <button onClick={this.btnSave} className="btn btn-primary">
                  Save
                </button>
                <button
                  onClick={() => this.setState({ modalEdit: false })}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              </ModalFooter>
            </Modal>
          )}

          <Modal //////// MODAL ADD STUDIO
            size="md"
            isOpen={modalAdd}
            toggle={() => this.setState({ modalAdd: false })}
          >
            <ModalHeader>Add New Studio</ModalHeader>
            <ModalBody>
              <span>Studio Name:</span>
              <input
                type="text"
                placeholder="studio name"
                ref="add_name"
                className="form-control mb-2"
              />
              <span>Total Seat:</span>
              <input
                type="number"
                placeholder="total seat"
                ref="add_totalSeat"
                className="form-control mb-2"
              />
            </ModalBody>
            <ModalFooter>
              <button onClick={this.btnAdd} className="btn btn-primary">
                Save
              </button>
              <button
                onClick={() => this.setState({ modalAdd: false })}
                className="btn btn-danger"
              >
                Cancel
              </button>
            </ModalFooter>
          </Modal>

          <center>
            {/* CONTENT */}
            <h1 className="my-4">Manage Studios</h1>
            <Table className="text-center" style={{ width: 800 }}>
              <thead>
                <tr>
                  <th style={{ width: 100 }}>#</th>
                  <th style={{ width: 300 }}>Studio Name</th>
                  <th style={{ width: 200 }}>Total Seat</th>
                  <th style={{ width: 200 }}>Action</th>
                </tr>
              </thead>

              <tbody>{this.renderTable()}</tbody>
            </Table>
            <button
              onClick={() => this.setState({ modalAdd: true })}
              className="btn btn-warning mx-auto"
            >
              Add New Studio
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
    AuthRole: state.Auth.role
  };
};

export default connect(mapStateToProps)(ManageStudio);
