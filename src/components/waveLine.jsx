import React from "react";
import styled from "styled-components";
import { ShWave } from "shwave";

const LineWrapper = styled.div`
  //底部时间轴 固定150px
  height: 150px;
  position: relative;
  display: flex;
  width: 100%;
  background-color: #c0d9d9;
  // border-top: 1px solid rgb(10, 10, 10);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
`;

const WaveLine = () => {
  return (
    <LineWrapper>
      <ShWave duration={15} backgroundColor={"#529393"} currentTime={1000} throttleWait={100}/>
    </LineWrapper>
  );
};

export default WaveLine;
