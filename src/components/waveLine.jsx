import React from "react";
import styled from "styled-components";
import { ShWave } from "shwave";
import { useMemo } from "react";

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

const WaveLine = ({
  currentTime,
  videoUrl,
  onWaveClick,
  onWaveContextmenu,
  subArray,
  onSubBlockMove,
  onSubBlockMoveError,
  onSubBlockResize,
  onSubBlockClick,
  onScrollIndexFrame,
}) => {
  //更新ScrollIndex （高頻率
  useMemo(() => {
    //对于空数组，findIndex是不会执行的 沒找到则返回-1
    const index = subArray.findIndex(
      (sub) => sub.start <= currentTime && sub.end > currentTime
    );
    if (index === -1) return;
    onScrollIndexFrame(index);
  }, [subArray, currentTime, onScrollIndexFrame]);
  return (
    <LineWrapper>
      <ShWave
        duration={15}
        backgroundColor={"#529393"}
        currentTime={currentTime}
        throttleWait={1}
        url={videoUrl}
        waveColor={"#fbf8f86b"}
        alterWaveColor={"#57e3e3"}
        waveScale={0.8}
        click={onWaveClick}
        contextmenu={onWaveContextmenu}
        subArray={subArray}
        onSubMove={onSubBlockMove}
        onSubMoveError={onSubBlockMoveError}
        onSubResize={onSubBlockResize}
        onSubClick={onSubBlockClick}
      />
    </LineWrapper>
  );
};

export default WaveLine;
