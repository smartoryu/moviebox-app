import React, { Component } from "react";
import { API_URL } from "../support/API_URL";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow
} from "@material-ui/core";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Axios from "axios";

class Admin extends Component {
  state = {
    dataMovies: [],
    readmoreSelected: -1,
    modalAdd: false
  };

  async componentDidMount() {
    try {
      var { data } = await Axios.get(`${API_URL}/movies`);
      this.setState({ dataMovies: data });
    } catch (err) {
      console.log(err);
    }
  }

  splitSynopsis = (val = "") => {
    var synopsis = val.split(". ").filter((val, index) => index < 1);
    return synopsis;
  };

  renderSynopsis = (val, index) => {
    return this.state.readmoreSelected === index ? (
      <TableCell>
        {val.synopsis}
        <p>
          <span
            className="span"
            onClick={() => this.setState({ readmoreSelected: -1 })}
          >
            (Read less...)
          </span>
        </p>
      </TableCell>
    ) : (
      <TableCell>
        {this.splitSynopsis(val.synopsis)}.
        <p>
          <span
            className="span"
            onClick={() => this.setState({ readmoreSelected: index })}
          >
            (Read more...)
          </span>
        </p>
      </TableCell>
    );
  };

  addData = () => {
    var scheduleTemp = [12, 14, 15, 18, 20];
    var schedule = [];
    for (let i = 0; i < 5; i++) {
      if (this.refs[`schedule${i}`].checked) {
        schedule.push(scheduleTemp[i]);
      }
    }
    console.log(schedule);

    // const { ref } = this.refs;

    // var image = ref.image.value;
    // var title = ref.title.value;
    // var duration = ref.duration.value;
    // var schedule = ref.schedule.value;
    // var genre = ref.genre.value;
    // var producer = ref.producer.value;
    // var director = ref.director.value;
    // var writer = ref.writer.value;
    // var production = ref.production.value;
    // var casts = ref.casts.value;
    // var synopsis = ref.synopsis.value;

    // var data = {
    //   image,
    //   title,
    //   duration,
    //   schedule,
    //   genre,
    //   producer,
    //   director,
    //   writer,
    //   production,
    //   casts,
    //   synopsis
    // };

    // Axios.post(`${API_URL}movies`.data)
    //   .then(res => {
    //     console.log(res.data);
    //     Axios.get(`${API_URL}movies`)
    //       .then(res => {
    //         this.setState({ dataMovies: res.data, modalAdd: false });
    //       })
    //       .catch(err => {
    //         console.log(err);
    //       });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  };

  renderMovies = () => {
    return this.state.dataMovies.map((val, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{val.title}</TableCell>
          <TableCell>
            <img src={val.image} alt="..." height="200px" />
          </TableCell>

          {this.renderSynopsis(val, index)}
          <TableCell>{val.schedule}</TableCell>
          <TableCell>{val.director}</TableCell>
          <TableCell>{val.genre}</TableCell>
          <TableCell>{val.duration}</TableCell>
          <TableCell>
            <button className="btn btn-outline-primary">Edit</button>
            <button className="btn btn-outline-danger">Delete</button>
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.modalAdd}
          toggle={() => this.setState({ modalAdd: false })}
        >
          <ModalHeader>Add Data</ModalHeader>
          <ModalBody>
            <input
              type="text"
              ref="title"
              placeholder="title"
              className="form-control"
            />
            <input
              type="text"
              ref="image"
              placeholder="image"
              className="form-control"
            />
            <input
              type="text"
              ref="synopsis"
              placeholder="synopsis"
              className="form-control"
            />
            <div className="form-control">
              Jadwal:
              <input type="checkbox" ref="schedule0" />
              12.00
              <input type="checkbox" ref="schedule1" />
              14.00
              <input type="checkbox" ref="schedule2" />
              16.00
              <input type="checkbox" ref="schedule3" />
              18.00
              <input type="checkbox" ref="schedule4" />
              20.00
            </div>
            <input
              type="text"
              ref="director"
              placeholder="director"
              className="form-control"
            />
            <input
              type="text"
              ref="genre"
              placeholder="genre"
              className="form-control"
            />
            <input
              type="text"
              ref="duration"
              placeholder="duration"
              className="form-control"
            />
          </ModalBody>
          <ModalFooter>
            <button onClick={this.addData} className="btn btn-primary">
              Save
            </button>
            <button
              onClick={() => this.setState({ modalAdd: false })}
              className="btn btn-danger"
            >
              Delete
            </button>
          </ModalFooter>
        </Modal>
        <div className="ml-auto">
          <button
            onClick={() => this.setState({ modalAdd: true })}
            className="btn btn-outline-warning"
          >
            Add Data
          </button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Synopsis</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Director</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.renderMovies()}</TableBody>
        </Table>
      </div>
    );
  }
}

export default Admin;
