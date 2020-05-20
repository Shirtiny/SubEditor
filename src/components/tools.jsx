import React from "react";
import styled from "styled-components";
import RippleButton from "./common/rippleButton";

const ToolsWrapper = styled.div`
  flex: 1;
  display: flex;
  padding: 15px;

  .toolsContainerBox {
    display: flex;
    flex: 1;
  }

  .clearBox {
    flex: 1;
    display: flex;
    flex-direction: column-reverse;
  }
  .toolsBox {
    flex: 1;
    border: 1px dashed #529393;
    display: flex;
    flex-direction: column;

    .shRow {
      display: flex;
    }

    .shRowHeader {
      width: 100px;
      display: flex;
      padding: 5px;
      justify-content: center;
      align-items: center;
    }

    .shRowBody {
      flex: 1;
      display: flex;
      padding: 5px;
      justify-content: center;
      flex-direction: row;

      .toolsBtn {
        margin-right: 15px;
        
      }
    }
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
      <div className="toolsContainerBox">
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
        <div className="toolsBox">
          <div className="shRow">
            <div className="shRowHeader">
              <RippleButton
                disabled={true}
                label="常规"
                width="50px"
                height="40px"
                color="gray"
                bgColor="white"
                title="dd"
                onClick={() => console.log("click")}
              />
            </div>
            <div className="shRowBody">
              <RippleButton
                className="toolsBtn"
                label="波纹按钮"
                color="gray"
                bgColor="#529393"
                title="dd"
                onClick={() => console.log("click")}
              />
              <RippleButton
                className="toolsBtn"
                label="波纹按钮"
                color="gray"
                bgColor="#529393"
                title="dd"
                onClick={() => console.log("click")}
              />
              <RippleButton
                className="toolsBtn"
                label="波纹按钮"
                color="gray"
                bgColor="#529393"
                title="dd"
                onClick={() => console.log("click")}
              />
            </div>
          </div>
        </div>
      </div>
    </ToolsWrapper>
  );
};

export default React.memo(Tools);
