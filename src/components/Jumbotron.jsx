import React, { Component } from "react";
import { Jumbotron, Container } from "reactstrap";
import { API_URL } from "../support/API_URL";
import Axios from "axios";

class Jumbo extends Component {
  state = {
    dataMovies: []
  };

  async componentDidMount() {
    try {
      var { data } = await Axios.get(`${API_URL}/movies`);
      this.setState({ dataMovies: data });
    } catch (error) {
      console.log(error);
    }
  }

  render = () => {
    return this.state.dataMovies.map((val, index) => {
      return (
        <div key={index}>
          <Jumbotron fluid>
            <Container fluid>
              <div className="card-deck">
                <div className="">
                  <img src={val.image} alt="..." />
                </div>
                <div className="card p-3">
                  <h4 className="card-title">"{val.title}"</h4>
                  <ul className="card-text jumbotron-text">
                    <li>Duration: {val.duration} minutes</li>
                    <li>Genre: {val.genre}</li>
                    <li>Schedule: {val.schedule}</li>
                    <li>Producer: {val.producer}</li>
                    <li>Director: {val.director}</li>
                    <li>Writer: {val.writer}</li>
                    <li>Production: {val.production}</li>
                    <li>
                      Casts:
                      <br />
                      {val.casts}
                    </li>
                    <li>
                      Synopsis:
                      <br />
                      {val.synopsis}
                    </li>
                  </ul>
                </div>
              </div>
            </Container>
          </Jumbotron>
        </div>
      );
    });
  };
}

export default Jumbo;
