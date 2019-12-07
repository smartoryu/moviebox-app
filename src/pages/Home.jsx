import React, { Component } from "react";
import Axios from "axios";
import { API_URL } from "../support/API_URL";
// import { connect } from "react-redux";
// import { storeAPI } from "../redux/action";
import Carousel from "../components/Carousel";
import Jumbotron from "../components/Jumbotron";

class Home extends Component {
  state = {
    dataMovies: [],
    readmoreSelected: -1
  };

  async componentDidMount() {
    try {
      var { data } = await Axios.get(`${API_URL}/movies`);
      this.setState({ dataMovies: data });
    } catch (error) {
      console.log(error);
    }
  }

  splitSynopsis = (val = "") => {
    var synopsis = val.split(". ").filter((val, index) => index < 1);
    return synopsis;
  };

  renderSynopsis = (val, index) => {
    return this.state.readmoreSelected === index ? (
      <p className="card-text">
        {val.synopsis}
        <p>
          <span
            className="span"
            onClick={() => this.setState({ readmoreSelected: -1 })}
          >
            (Read less...)
          </span>
        </p>
      </p>
    ) : (
      <p className="card-text">
        {this.splitSynopsis(val.synopsis)}.
        <p>
          <span
            className="span"
            onClick={() => this.setState({ readmoreSelected: index })}
          >
            (Read more...)
          </span>
        </p>
      </p>
    );
  };

  renderMovies = () => {
    return this.state.dataMovies.map((val, index) => {
      return (
        <div key={index} className="card px-1">
          <div className="img-container radius">
            <img src={val.image} className="card-img-top" alt="..." />
          </div>
          <div className="card-body">
            <h5 className="card-title mx-auto bold">{val.title}</h5>
            {/* {this.renderSynopsis(val, index)} */}
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
        <Jumbotron dataMovies={this.state.dataMovies} />
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
