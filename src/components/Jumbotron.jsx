import React, { Component } from "react";
import { Jumbotron, Container } from "reactstrap";
import { API_URL } from "../support/API_URL";
import Axios from "axios";

class Jumbo extends Component {
  state = {
    dataMovies: []
    // ,
    // image: [],
    // wideImage: [],
    // title: [],
    // duration: [],
    // schedule: [],
    // genre: [],
    // producer: [],
    // director: [],
    // writer: [],
    // production: [],
    // casts: [],
    // synopsis: []
  };

  async componentDidMount() {
    try {
      var { data } = await Axios.get(`${API_URL}/movies`);
      this.setState({ dataMovies: data });
    } catch (error) {
      console.log(error);
    }
  }

  mapToSingleState() {
    return this.state.dataMovies.map((val, index) => {
      return this.setState({});
    });

    // return (
    //   this.setState({ image: val.image }),
    //   this.setState({ wideImage: val.wideImage }),
    //   this.setState({ title: val.title }),
    //   this.setState({ duration: val.duration }),
    //   this.setState({ schedule: val.schedule }),
    //   this.setState({ genre: val.genre }),
    //   this.setState({ producer: val.image }),
    //   this.setState({ director: val.director }),
    //   this.setState({ writer: val.writer }),
    //   this.setState({ production: val.production }),
    //   this.setState({ casts: val.casts }),
    //   this.setState({ synopsis: val.synopsis })
    // );
  }

  renderLandscape = () => {
    return this.state.dataMovies.map((val, index) => {
      return (
        <div key={index} className={`landscape${index}`}>
          <div className="movie-container">
            <img src={val.wideImage} alt="..." />
          </div>
          <div className="movie-genre">
            <p>{val.genre}</p>
          </div>
          <div className="movie-title">
            <p>{val.title}</p>
          </div>
          <div className="movie-duration">
            <p>{val.duration}</p>
          </div>
        </div>
      );
    });
  };

  render() {
    return <div className="slideshow">{this.renderLandscape()}</div>;
  }
}

export default Jumbo;
