import React from "react";
import styled from "styled-components";
import Input from "./common/input";

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
  onRowCommit,
  onRowCancel,
  editingSub,
  errors,
  onInputValueChange
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
          title="编辑"
        ></i>
        <i
          onClick={() => onRowCommit(sub)}
          className={`fa fa-check-circle-o ${displayOnEditing}`}
          title="保存"
        ></i>
        <i
          className="fa fa-times"
          onClick={() => onRowRemove(sub)}
          title="删除"
        ></i>
      </div>
      {/* 开始时间 */}
      <div className="rowT" style={{ width: 100 }}>
        <span className={`${hiddenOnEditing}`}>{sub.startTime}</span>
        <Input
          className={[displayOnEditing]}
          type="text"
          name="startTime"
          value={editingSub.startTime}
          onChange={onInputValueChange}
          errors={errors}
        />
      </div>
      {/* 结束时间 */}
      <div className="rowT" style={{ width: 100 }}>
        <span className={`${hiddenOnEditing}`}>{sub.endTime}</span>
        <Input
          className={[displayOnEditing]}
          type="text"
          name="endTime"
          value={editingSub.endTime}
          onChange={onInputValueChange}
          errors={errors}
        />
      </div>
      {/* 时长 */}
      <div className="rowT" style={{ width: 100 }}>
        <span className={`${hiddenOnEditing}`}>{sub.length}</span>
        <span className={`${displayOnEditing}`}>{sub.length}</span>
      </div>
      {/* 文本内容 */}
      <div className="rowT" style={{ flex: 1 }}>
        <span className={`${hiddenOnEditing}`}>{sub.content}</span>
        <Input
          className={[displayOnEditing]}
          type="text"
          name="content"
          value={editingSub.content}
          onChange={onInputValueChange}
          errors={errors}
        />
      </div>
      {/* 序号 ， 取消按钮*/}
      <div className="rowT operation" style={{ width: 50 }}>
        <span className={`${hiddenOnEditing}`}>{index}</span>
        <i
          onClick={() => onRowCancel(sub)}
          className={`fa fa-reply ${displayOnEditing}`}
          title="取消编辑"
        ></i>
      </div>
    </RowWrap>
  );
};

export default SubRow;
