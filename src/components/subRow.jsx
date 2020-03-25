import React from "react";
import styled from "styled-components";

const RowWrap = styled.div`
  background-color: #f2f2f2;
  // border-bottom: 1px solid rgb(36, 41, 45);
  min-width: 650px;
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

  &.onEditing {
    //编辑时返回隐藏 非编辑状态返回显示
    .display_onEditing {
      display: block;
    }
    .hidden_onEditing {
      display: none;
    }
  }

  .editing_default_hidden {
    //默认隐藏
    display: none;
    width: 100%;
    height: 100%;
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

const SubRow = ({
  index,
  style,
  className,
  rowData: sub,
  onRowRemove,
  onRowEdit,
  onRowCommit
}) => {
  const hiddenOnEditing = "hidden_onEditing";
  const displayOnEditing = ["editing_default_hidden", "display_onEditing"].join(
    " "
  );
  return (
    <RowWrap
      key={index}
      style={style}
      className={[
        className,
        index % 2 ? "odd" : "",
        sub.editing ? "onEditing" : ""
      ].join(" ")}
    >
      {/* 操作按钮 */}
      <div className="rowT operation" style={{ width: 90 }}>
        <i
          onClick={() => onRowEdit(sub)}
          className={`fa fa-pencil ${hiddenOnEditing}`}
        ></i>
        <i
          onClick={() => onRowCommit(sub)}
          className={`fa fa-check-circle-o ${displayOnEditing}`}
        ></i>
        <i className="fa fa-times" onClick={() => onRowRemove(sub)}></i>
      </div>
      {/* 开始时间 */}
      <div className="rowT" style={{ width: 100 }}>
        <span className={`${hiddenOnEditing}`}>{sub.startTime}</span>
        <input className={`${displayOnEditing}`} type="text" />
      </div>
      {/* 结束时间 */}
      <div className="rowT" style={{ width: 100 }}>
        <span className={`${hiddenOnEditing}`}>{sub.endTime}</span>
        <input className={`${displayOnEditing}`} type="text"/>
      </div>
      {/* 时长 */}
      <div className="rowT" style={{ width: 100 }}>
        {sub.length}
      </div>
      {/* 文本内容 */}
      <div className="rowT" style={{ flex: 1 }}>
        <span className={`${hiddenOnEditing}`}>{sub.content}</span>
        <input className={`${displayOnEditing}`} type="text"/>
      </div>
      {/* 序号 */}
      <div className="rowT" style={{ width: 50 }}>
        {index}
      </div>
    </RowWrap>
  );
};

export default SubRow;
