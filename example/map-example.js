import React, { Component } from "react";

import ReactMapboxGl from "../src/index.js";

const apiToken = "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A";

export default class MapExample extends Component {

  state = {
  };

  render() {
    return (
      <div>
        <ReactMapboxGl/>
      </div>
    );
  }
}