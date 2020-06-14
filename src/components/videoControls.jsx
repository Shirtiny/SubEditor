import React from "react";
import styled from "styled-components";

const VideoControlBox = styled.div`
  display: flex;
  margin-bottom: 15px;
  justify-content: space-around;

  .controlIcon {
    color: #529393;
    transition: color 0.2s ease;
    &:hover {
      color: #66cccc;
    }
  }
`;

const VideoControls = ({ onAction, playerPaused }) => {
  return (
    <VideoControlBox>
      <i
        className="fa fa-fast-backward controlIcon"
        title="ctrl alt ← 回退10秒"
        onClick={() => onAction(-10)}
      ></i>
      <i
        className="fa fa-backward controlIcon"
        title="ctrl ← 回退1秒"
        onClick={() => onAction(-1)}
      ></i>
      <i
        className="fa fa-step-backward controlIcon"
        title="← 回退0.1秒"
        onClick={() => onAction(-0.1)}
      ></i>
      {!playerPaused ? (
        <i
          className="fa fa-pause controlIcon"
          title="space 暂停"
          onClick={() => onAction()}
        ></i>
      ) : (
        <i
          className="fa fa-play controlIcon"
          title="space 播放"
          onClick={() => onAction()}
        ></i>
      )}
      <i
        className="fa fa-step-forward controlIcon"
        title="→ 前进0.1秒"
        onClick={() => onAction(0.1)}
      ></i>
      <i
        className="fa fa-forward controlIcon"
        title="ctrl → 前进1秒"
        onClick={() => onAction(1)}
      ></i>
      <i
        className="fa fa-fast-forward controlIcon"
        title="ctrl alt → 前进10秒"
        onClick={() => onAction(10)}
      ></i>
    </VideoControlBox>
  );
};

export default VideoControls;