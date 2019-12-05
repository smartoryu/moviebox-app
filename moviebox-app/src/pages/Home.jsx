import React, { Component } from "react";
import Axios from "axios";
const url = "http://localhost:2000/";

class Home extends Component {
  state = {
    dataMovies: []
  };

  async componentDidMount() {
    try {
      var { data } = await Axios.get(`${url}movies`);
      this.setState({ dataMovies: data });
    } catch (error) {
      console.log(error);
    }
  }

  renderMovies = () => {
    return this.state.dataMovies.map((val, index) => {
      return (
        <div key={index} className="card px-1">
          <div className="img-container radius">
            <img src={val.image} className="card-img-top" alt="..." />
          </div>
          <div className="card-body">
            <h5 className="card-title mx-auto bold">{val.title}</h5>
            <p className="card-text">{this.renderSynopsis()}</p>
          </div>
        </div>
      );
    });
  };

  renderSynopsis = () => {
    return this.state.dataMovies.map((val, index) => {
      var synopsis = val.synopsis.split(". ");
      return console.log(synopsis);
    });
  };

  render() {
    return (
      <div>
        <div className="card-deck mt-3 mx-2 px-4">{this.renderMovies()}</div>
      </div>
    );
  }
}

export default Home;
