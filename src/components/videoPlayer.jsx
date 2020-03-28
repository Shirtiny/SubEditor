import React, { Component } from "react";
import styled from "styled-components";

const VideoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

class VideoPlayer extends Component {
  state = {};
  render() {
    return (
      <VideoWrapper>
        VideoPlayer
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
