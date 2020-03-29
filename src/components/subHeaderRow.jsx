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
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
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

    // &:hover {
    //   color: #fff;
    //   background-color: #43d7d7;
    //   span {
    //     display: block;
    //   }
    // }
  }
`;

const SubHeaderRow = props => {
  return (
    <HeaderRowWrap>
      <div className="rowT" style={{ width: 100 }}>
        <span className="buttonLike">
          <i className="fa fa-pencil-square-o" aria-hidden="true"></i>编辑
        </span>
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
        <span className="buttonLike fa fa-sort-amount-asc"></span>
      </div>
    </HeaderRowWrap>
  );
};

export default SubHeaderRow;
