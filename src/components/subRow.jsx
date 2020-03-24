import React from "react";
import styled from "styled-components";

const RowWrap = styled.div`
  background-color: #f2f2f2;
  // border-bottom: 1px solid rgb(36, 41, 45);
  transition: all 0.2s ease;

  &.odd {
    background-color: #fff;
  }

  &.highlight {
    background-color: #2196f3;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  }

  &.illegal {
    background-color: #c75123;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  }

  .rowT {
    padding: 10px 5px;
    text-align: center;
  }

  &: hover {
    background-color: #529393;
    color: #fff;
    //字稍微大些
    font-size: 14px;
  }

  .operation {
    display: flex;
    justify-content: center;

    i {
      width: 25px;
      cursor: pointer;
      font-size: 16px;
      &: hover {
        //图标粗些
        font-weight: 600;
        color: #ccc;
      }
    }
  }
`;

const SubRow = ({ index, style, className, rowData: sub, onRemove }) => {
  return (
    <RowWrap
      key={index}
      style={style}
      className={[className, index % 2 ? "odd" : ""].join(" ")}
    >
      <div className="rowT operation" style={{ width: 90 }}>
        <i className="fa fa-pencil"></i>
        <i className="fa fa-times" onClick={() => onRemove(sub)}></i>
      </div>
      <div className="rowT" style={{ width: 100 }}>
        {sub.startTime}
      </div>
      <div className="rowT" style={{ width: 100 }}>
        {sub.endTime}
      </div>
      <div className="rowT" style={{ width: 100 }}>
        {sub.length}
      </div>
      <div className="rowT" style={{ flex: 1 }}>
        {sub.content}
      </div>
      <div className="rowT" style={{ width: 50 }}>
        {index}
      </div>
    </RowWrap>
  );
};

export default SubRow;
