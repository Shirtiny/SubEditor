import React from "react";
import styled from "styled-components";

const ToolsWrapper = styled.div`
  flex: 1;
  display: flex;
  padding: 15px;
  .clearBox {
    flex: 1;
    display: flex;
    flex-direction: column-reverse;
  }
  .toolsBox {
    flex: 1;
    // border: 1px solid;
  }

  //滑块样式
  input[type="range"] {
    appearance: none;
    height: 3px;
    width: 200px;
    outline: none;
    background-color: #529393;
    border-radius: 10px;
  }

  //chorme
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 15px;
    width: 15px;
    background: #ffffff;
    border-radius: 50%;
  }
`;

const Tools = ({ duration, onDurationChange }) => {
  return (
    <ToolsWrapper>
      <div className="clearBox">
        <input
          type="range"
          title={duration}
          value={duration}
          min="10"
          max="20"
          step="1"
          onChange={(e) => {
            onDurationChange(Number(e.currentTarget.value));
          }}
        />
      </div>
      {/* <div className="toolsBox">工具区</div> */}
    </ToolsWrapper>
  );
};

export default React.memo(Tools);
