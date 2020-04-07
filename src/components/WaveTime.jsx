import React, { Component } from "react";
import WaveSurfer from "wavesurfer.js";

class WaveTime extends Component {
  state = {};
  ws = null;

  componentDidMount() {
    this.ws = WaveSurfer.create({
      container: document.querySelector("#waveform"),
      waveColor: "violet",
      progressColor: "purple",
      backend: "MediaElement",
    });
    var mediaElt = document.querySelector("#video");
    this.ws.load(mediaElt);
  }

  render() {
    return <div id="waveform"></div>;
  }
}

export default WaveTime;
