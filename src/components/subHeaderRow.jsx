import React from "react";
import styled from "styled-components";

const HeaderRowWrap = styled.div`
  background: #c0d9d9;
  display: flex;
  min-width: 650px;

  .rowT {
    padding: 10px 5px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    text-align: center;
    text-transform: none;
  }

  .buttonLike {
    position: relative;
    background: #ffffff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    // margin-right: 10px;
    padding: 9px 16px;
    border-style: none;
    border-radius: 10px;
    overflow: hidden;
    transition: all 200ms linear 0s;

    i {
      margin-right: 5px;
    }
  }

  .switchButton {
    cursor: pointer;
    &:hover {
      color: #fff;
      background-color: #43d7d7;
      span {
        display: block;
      }
    }
  }

  .stayButton {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0px;
    cursor: pointer;
    span {
      position: relative;
      top: 4px;
    }
    transition: all 0.3s ease;
    &:hover {
      color: #fff;
      background-color: #43d7d7;
    }
  }
`;

const SubHeaderRow = props => {
  const {
    displayIndex,
    onDisplayIndexSwitch,
    subArrayLenIsZero,
    onInsert
  } = props;
  return (
    <HeaderRowWrap>
      <div className="rowT" style={{ width: 100 }}>
        <div className="buttonLike">
          <span style={{ display: subArrayLenIsZero ? "none" : "block" }}>
            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>编辑
          </span>
          <div
            onClick={() => onInsert()}
            className="stayButton"
            style={{ display: subArrayLenIsZero ? "block" : "none" }}
          >
            <span>
              <i className="fa fa-plus" aria-hidden="true"></i>新建
            </span>
          </div>
        </div>
      </div>
      <div className="rowT" style={{ width: 100 }}>
        <span className="buttonLike">
          <i className="fa fa-step-backward" aria-hidden="true"></i>
          开始
        </span>
      </div>
      <div className="rowT" style={{ width: 100 }}>
        <span className="buttonLike">
          <i className="fa fa-step-forward" aria-hidden="true"></i>
          结束
        </span>
      </div>
      <div className="rowT" style={{ width: 100 }}>
        <span className="buttonLike">
          <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
          时长
        </span>
      </div>
      <div className="rowT" style={{ flex: 1 }}>
        <span className="buttonLike ">
          <i className="fa fa-text-width" aria-hidden="true"></i>内容
        </span>
      </div>
      <div className="rowT" style={{ width: 50 }}>
        <div
          className="buttonLike switchButton"
          onClick={() => onDisplayIndexSwitch(!displayIndex)}
        >
          <span
            style={{ display: displayIndex ? "block" : "none" }}
            className=" fa fa-sort-amount-asc"
            title="切换到功能"
          ></span>
          <span
            style={{ display: displayIndex ? "none" : "block" }}
            className=" fa fa-sliders"
            title="切换到序号"
          ></span>
        </div>
      </div>
    </HeaderRowWrap>
  );
};

export default SubHeaderRow;
