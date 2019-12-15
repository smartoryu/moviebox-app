import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

import { API_URL } from "../support/API_URL";

class Home extends Component {
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

  renderMovies = () => {
    return this.state.dataMovies.map((val, index) => {
      return (
        <div key={index} className="card px-1">
          <div className="img-container radius">
            <Link to={`/movie_detail/${val.id}`}>
              <img src={val.image} className="card-img-top" alt="..." />
            </Link>
          </div>
          <div className="card-body">
            <h5 className="card-title mx-auto bold">{val.title}</h5>
          </div>
        </div>
      );
    });
  };

  splitSynopsis = (val = "") => {
    var synopsis = val.split(". ").filter((val, index) => index < 1);
    return synopsis;
  };

  render() {
    return (
      <div>
        {/* <Carousel /> */}
        {/* <Jumbo /> */}
        <div className="mx-6">
          <div className="card-deck mt-5 mx-6 px-5">{this.renderMovies()}</div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return { dataMovies: state.dataMovies.state };
// };

export default // connect(mapStateToProps, { storeAPI })
Home;
