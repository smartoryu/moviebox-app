import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Table } from "reactstrap";
import { Redirect } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Loading from "../components/Loading";

import { API_URL } from "../support/API_URL";

const MySwal = withReactContent(Swal);

class ManageAdmin extends Component {
  state = {
    dataMovies: [],
    dataStudios: [],
    readmoreSelected: -1,
    modalAdd: false,
    modalEdit: false,
    selectedIdEdit: -1,
    selectedIdDel: -1,
    indexEdit: -1,
    schedule: [12, 14, 16, 18, 20]
  };

  async componentDidMount() {
    try {
      var movies = await Axios.get(`${API_URL}/movies`);
      console.log("movies", movies);
      try {
        var studios = await Axios.get(`${API_URL}/studios`);
        console.log("studios", studios);
      } catch (errStudios) {
        console.log(errStudios);
      }

      this.setState({ dataMovies: movies.data, dataStudios: studios.data });
    } catch (errMovies) {
      console.log(errMovies);
    }
  }

  // BUTTON SAVE ON ADD
  btnSave = () => {
    var schedule = [];
    var scheduleTemplate = [12, 14, 16, 18, 20];
    for (let i = 0; i < scheduleTemplate.length; i++) {
      if (this.refs[`schedule${i}`].checked) {
        schedule.push(scheduleTemplate[i]);
      }
    }
    console.log("schedule", schedule);

    const ref = this.refs;
    var image = ref.image.value;
    var wideImage = ref.wideImage.value;
    var title = ref.title.value;
    var duration = ref.duration.value;
    var studioId = ref.studio.value;
    var trailer = ref.trailer.value;
    var genre = ref.genre.value;
    var producer = ref.producer.value;
    var director = ref.director.value;
    var writer = ref.writer.value;
    var production = ref.production.value;
    var casts = ref.casts.value;
    var synopsis = ref.synopsis.value;

    var newObj = {
      image,
      wideImage,
      title,
      duration,
      studioId,
      trailer,
      schedule,
      genre,
      producer,
      director,
      writer,
      production,
      casts,
      synopsis
    };

    if ({ ...(newObj !== "") }) {
      Axios.post(`${API_URL}/movies`, newObj)
        .then(() => {
          Axios.get(`${API_URL}/movies`)
            .then(res => {
              this.setState({ dataMovies: res.data, modalAdd: false });
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
        title: "Oops...",
        text: "Data incomplete!"
      });
    }
  };

  // BUTTON DELETE
  btnDelete = index => {
    MySwal.fire({
      title: `Are you sure deleting ${this.state.dataMovies[index].title}?`,
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then(res => {
      if (res.value) {
        var dataMovie = this.state.dataMovies;
        this.setState({ selectedIdDel: dataMovie[index]["id"] });
        console.log("Deleted ID Movie", dataMovie[index]["id"]);
        dataMovie.splice(index, 1);
        this.setState({ dataMovie: dataMovie });
        MySwal.fire("Deleted", "Deleted!", "success")
          .then(() => {
            Axios.delete(`${API_URL}/movies/${this.state.selectedIdDel}`);
          })
          .catch(err => {
            console.log(err);
          });
      } else if (res.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire("Cancelled", "Cancelled", "error");
      }
    });
  };

  // BUTTON EDIT
  btnEdit = index => {
    var editData = this.state.dataMovies;
    this.setState({
      modalEdit: true,
      indexEdit: index,
      selectedIdEdit: editData[index].id
    });
  };

  // RENDER @ADD CHECKBOX
  renderAddSchedule = () => {
    return this.state.schedule.map((val, index) => {
      return (
        <div key={index}>
          <input type="checkbox" ref={`schedule${index}`} />
          <span className="mr-2">{val}.00</span>
        </div>
      );
    });
  };

  // RENDER @EDIT CHECKBOX
  renderEditSchedule = indexEdit => {
    var indexArr = []; // menyimpan jadwal yang sudah terpilih
    var dataMovieEdit = this.state.dataMovies[indexEdit].schedule;
    for (let i = 0; i < dataMovieEdit.length; i++) {
      for (let j = 0; j < this.state.schedule.length; j++) {
        if (dataMovieEdit[i] === this.state.schedule[j]) {
          indexArr.push(j);
        }
      }
    }

    var scheduleCheckbox = this.state.schedule;
    var scheduleCheckboxNew = []; // membuat default semua jadwal un-checked
    scheduleCheckbox.forEach(val => {
      scheduleCheckboxNew.push({ time: val, checked: false });
    });

    indexArr.forEach(val => {
      // jadwal yang sebelumnya sudah terpilih, di-checked semua
      scheduleCheckboxNew[val].checked = true;
    });

    return scheduleCheckboxNew.map((val, index) => {
      if (val.checked) {
        return (
          <div key={index}>
            <input
              defaultChecked
              type="checkbox"
              ref={`edit_schedule${index}`}
              value={val.time}
            />
            <span className="mr-2">{val.time}.00</span>
          </div>
        );
      } else {
        return (
          <div key={index}>
            <input
              type="checkbox"
              ref={`edit_schedule${index}`}
              value={val.time}
            />
            <span className="mr-2">{val.time}.00</span>
          </div>
        );
      }
    });
  };

  // BUTTON SAVE ON EDIT
  updateDataMovies = () => {
    var edit_schedule = [];
    var schedule = [];
    var scheduleTemplate = [12, 14, 16, 18, 20];
    var id = this.state.selectedIdEdit;
    if (this.state.dataMovies[id].schedule) {
      for (let i = 0; i < scheduleTemplate.length; i++) {
        if (this.refs[`edit_schedule${i}`].checked) {
          edit_schedule.push(scheduleTemplate[i]);
        }
      }
    } else {
      for (let i = 0; i < scheduleTemplate.length; i++) {
        if (this.refs[`schedule${i}`].checked) {
          schedule.push(scheduleTemplate[i]);
        }
      }
    }
    console.log("edit schedule", edit_schedule);

    const ref = this.refs;
    var image = ref.edit_image.value;
    var wideImage = ref.edit_wideImage.value;
    var title = ref.edit_title.value;
    var duration = ref.edit_duration.value;
    var studioId = ref.edit_studio.value;
    var trailer = ref.edit_trailer.value;
    var genre = ref.edit_genre.value;
    var producer = ref.edit_producer.value;
    var director = ref.edit_director.value;
    var writer = ref.edit_writer.value;
    var production = ref.edit_production.value;
    var casts = ref.edit_casts.value;
    var synopsis = ref.edit_synopsis.value;

    var newObj = {
      image,
      wideImage,
      title,
      duration,
      studioId,
      trailer,
      edit_schedule,
      schedule,
      genre,
      producer,
      director,
      writer,
      production,
      casts,
      synopsis
    };

    if ({ ...(newObj !== "") }) {
      Axios.put(`${API_URL}/movies/${id}`, newObj)
        .then(() => {
          Axios.get(`${API_URL}/movies`)
            .then(res => {
              Swal.fire({
                icon: "success",
                title: "Data saved"
              }).then(() => {
                this.setState({ dataMovies: res.data, modalEdit: false });
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
        title: "Oops...",
        text: "Data incomplete!"
      });
    }
  };

  // SPLIT SINOPSIS
  splitSynopsis = (val = "") => {
    var synopsis = val.split(". ").filter((val, index) => index < 1);
    return synopsis;
  };
  renderSynopsis = (val, index) => {
    return this.state.readmoreSelected === index ? (
      <td>
        {val.synopsis}
        <p>
          <span
            className="span"
            onClick={() => this.setState({ readmoreSelected: -1 })}
          >
            (Read less...)
          </span>
        </p>
      </td>
    ) : (
      <td>
        {this.splitSynopsis(val.synopsis)}.
        <p>
          <span
            className="span"
            onClick={() => this.setState({ readmoreSelected: index })}
          >
            (Read more...)
          </span>
        </p>
      </td>
    );
  };

  // RENDER MOVIES
  renderMovies = () => {
    return this.state.dataMovies.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{val.title}</td>
          <td>
            <img src={val.image} alt="..." height="200px" />
          </td>
          <td>{val.genre}</td>
          <td>{val.studioId}</td>
          <td>{val.duration}</td>
          <td>{val.schedule}</td>
          <td>{val.director}</td>
          <td>{val.production}</td>
          <td>{val.trailer}</td>
          <td>{val.casts}</td>
          {this.renderSynopsis(val, index)}
          <td>
            <button
              className="btn btn-outline-primary px-4 mb-3"
              onClick={() => this.btnEdit(index)}
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger px-3"
              onClick={() => this.btnDelete(index)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  render() {
    const { dataMovies, indexEdit } = this.state;
    const { Role } = this.props;
    if (dataMovies === 0) {
      return <Loading />;
    }

    // console.log("role", Role);
    if (Role !== "admin") {
      return <Redirect to={"/"} />;
    }

    return (
      <div>
        {/* 
                ========== MODAL EDIT FILM ========== 
      */}
        {indexEdit === -1 ? null : (
          <Modal
            size="lg"
            isOpen={this.state.modalEdit}
            toggle={() => this.setState({ modalEdit: false })}
          >
            <ModalHeader>Edit Data {dataMovies[indexEdit].title}</ModalHeader>
            <ModalBody>
              <span>Poster Image:</span>
              <div className="d-flex mb-2">
                <img
                  src={dataMovies[indexEdit].image}
                  width="100px"
                  alt="..."
                />
                <input
                  type="text"
                  defaultValue={dataMovies[indexEdit].image}
                  ref="edit_image"
                  className="form-control ml-2 mb-auto"
                />
              </div>
              <span>Wide Poster Image:</span>
              <div className="d-flex mb-2">
                <img
                  src={dataMovies[indexEdit].wideImage}
                  width="100px"
                  alt="..."
                />
                <input
                  type="text"
                  ref="edit_wideImage"
                  defaultValue={dataMovies[indexEdit].wideImage}
                  className="form-control ml-2 mb-auto"
                />
              </div>
              <span>Title:</span>
              <input
                type="text"
                defaultValue={dataMovies[indexEdit].title}
                ref="edit_title"
                className="form-control mb-2"
              />
              <span>Genre:</span>
              <input
                type="text"
                defaultValue={dataMovies[indexEdit].genre}
                ref="edit_genre"
                className="form-control mb-2"
              />
              <span>Director:</span>
              <input
                type="text"
                defaultValue={dataMovies[indexEdit].director}
                ref="edit_director"
                className="form-control mb-2"
              />
              <span>Producer:</span>
              <input
                type="text"
                defaultValue={dataMovies[indexEdit].producer}
                ref="edit_producer"
                className="form-control mb-2"
              />
              <span>Writer:</span>
              <input
                type="text"
                defaultValue={dataMovies[indexEdit].writer}
                ref="edit_writer"
                className="form-control mb-2"
              />
              <span>Production:</span>
              <input
                type="text"
                defaultValue={dataMovies[indexEdit].production}
                ref="edit_production"
                className="form-control mb-2"
              />
              <span>Casts:</span>
              <input
                type="text"
                defaultValue={dataMovies[indexEdit].casts}
                ref="edit_casts"
                className="form-control mb-2"
              />
              <span>Studio:</span>
              <select ref="edit_studio" className="form-control mb-2">
                <option value="1">Studio 1</option>
                <option value="2">Studio 2</option>
                <option value="3">Studio 3</option>
              </select>
              <span>Duration:</span>
              <input
                type="text"
                defaultValue={dataMovies[indexEdit].duration}
                ref="edit_duration"
                className="form-control mb-2"
              />
              <span className="ml-1 mb-1">Jadwal:</span>
              <div className="form-control mb-2">
                <div className="d-flex">
                  {console.log(
                    "jadwal",
                    this.state.dataMovies[indexEdit].schedule
                  )}
                  {this.state.dataMovies[indexEdit].schedule
                    ? this.renderEditSchedule(indexEdit)
                    : this.renderAddSchedule()}
                </div>
              </div>
              <span>Trailer:</span>
              <input
                type="text"
                defaultValue={dataMovies[indexEdit].trailer}
                ref="edit_trailer"
                className="form-control mb-2"
              />
              <span>Synopsis:</span>
              <textarea
                type="text"
                defaultValue={dataMovies[indexEdit].synopsis}
                ref="edit_synopsis"
                className="form-control mb-2"
              />
            </ModalBody>
            <ModalFooter>
              <button
                onClick={this.updateDataMovies}
                className="btn btn-primary"
              >
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

        {/* 
                ========== MODAL ADD FILM ========== 
      */}
        <Modal
          size="lg"
          isOpen={this.state.modalAdd}
          toggle={() => this.setState({ modalAdd: false })}
        >
          <ModalHeader>Add Data</ModalHeader>
          <ModalBody>
            <span>Poster Image:</span>
            <input
              type="text"
              ref="image"
              placeholder="Image URL"
              className="form-control mb-2"
            />
            <span>Wide Poster Image:</span>
            <input
              type="text"
              ref="wideImage"
              placeholder="Wide Image URL"
              className="form-control mb-2"
            />
            <span>Title:</span>
            <input
              type="text"
              ref="title"
              placeholder="Title"
              className="form-control mb-2"
            />
            <span>Genre:</span>
            <input
              type="text"
              ref="genre"
              placeholder="Genre"
              className="form-control mb-2"
            />
            <span>Director:</span>
            <input
              type="text"
              ref="director"
              placeholder="Director"
              className="form-control mb-2"
            />
            <span>Producer:</span>
            <input
              type="text"
              ref="producer"
              placeholder="Producer"
              className="form-control mb-2"
            />
            <span>Writer:</span>
            <input
              type="text"
              ref="writer"
              placeholder="Writer"
              className="form-control mb-2"
            />
            <span>Production:</span>
            <input
              type="text"
              ref="production"
              placeholder="Production"
              className="form-control mb-2"
            />
            <span>Casts:</span>
            <input
              type="text"
              ref="casts"
              placeholder="Casts"
              className="form-control mb-2"
            />
            <span>Studio:</span>
            <select ref="studio" className="form-control mb-2">
              <option value="1">Studio 1</option>
              <option value="2">Studio 2</option>
              <option value="3">Studio 3</option>
            </select>
            <span>Duration:</span>
            <input
              type="text"
              ref="duration"
              placeholder="Duration"
              className="form-control mb-2"
            />
            <span className="ml-1 mb-1 ">Jadwal:</span>
            <div className="form-control mb-2">
              <div className="d-flex">{this.renderAddSchedule()}</div>
            </div>
            <span>Trailer:</span>
            <input
              type="text"
              ref="trailer"
              placeholder="Trailer"
              className="form-control mb-2"
            />
            <span>Synopsis:</span>
            <textarea
              type="text"
              ref="synopsis"
              placeholder="Synopsis"
              className="form-control mb-2"
            />
          </ModalBody>
          <ModalFooter>
            <button onClick={this.btnSave} className="btn btn-primary">
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

        {/* ========== BUTTON ADD ========== */}
        <div className="ml-auto">
          <button
            onClick={() => this.setState({ modalAdd: true })}
            className="mx-auto btn btn-outline-warning"
          >
            Add Data
          </button>
        </div>

        {/* OUTPUT TABLE DATA MOVIES */}
        <Table hover className="mx-auto mt-3 w-100">
          <thead>
            <tr>
              <th className="tbl-title">#</th>
              <th className="tbl-title">Title</th>
              <th className="tbl-title">Image</th>
              <th className="tbl-title">Genre</th>
              <th className="tbl-title">Studio ID</th>
              <th className="tbl-title">Duration</th>
              <th className="tbl-title">Schedule</th>
              <th className="tbl-title">Director</th>
              <th className="tbl-title">Production</th>
              <th className="tbl-title">Trailer</th>
              <th className="tbl-title">Casts</th>
              <th className="tbl-title">Synopsis</th>
              <th className="tbl-title">Action</th>
            </tr>
          </thead>
          <tbody className="tbl-body">{this.renderMovies()}</tbody>
        </Table>
      </div>
    );
    // } else {
    //   return <Redirect to={"/"} />;
    // }
  }
}

const mapStateToProps = state => {
  return {
    AuthLogin: state.Auth.login,
    Username: state.Auth.username,
    Role: state.Auth.role
  };
};

export default connect(mapStateToProps)(ManageAdmin);
