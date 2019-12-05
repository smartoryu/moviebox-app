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

  renderContent = () => {
    return this.state.dataMovies.map((val, index) => {
      return (
        <div key={index} className="col-md-3 py-5 pr-3 pl-1">
          <div className="card px-1">
            <div className="img-container radius">
              <img src={val.image} className="card-img-top" alt="..." />
            </div>
            <div className="card-body">
              <h5 className="card-title mx-auto bold">{val.title}</h5>
              <p className="card-text">{val.sinopsis}</p>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    return <div className="mt-2 mx-5 row">{this.renderContent()}</div>;
  }
}

export default Home;
