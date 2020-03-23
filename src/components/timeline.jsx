import React, { Component } from "react";
import styled from "styled-components";

const timelineHeight = 150;

const TimeWrapper = styled.div`
  position: relative;
  display: flex;
  height: ${timelineHeight}px;
  width: 100%;
  background-color: #c0d9d9;
  border-top: 1px solid rgb(10, 10, 10);
`;

class Timeline extends Component {
  state = {};
  render() {
    return <TimeWrapper>Timeline</TimeWrapper>;
  }
}

export default Timeline;
