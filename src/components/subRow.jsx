import React from "react";
import styled from "styled-components";
import Input from "./common/input";

const RowWrap = styled.div`
  .rowClasses {
    background-color: #f2f2f2;
    // border-bottom: 1px solid rgb(36, 41, 45);
    min-width: 650px;
    transition: all 0.2s ease;

    //取消浏览器的双击选中
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;

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
      background-color: #66cccc;

      //编辑时返回隐藏 非编辑状态返回显示
      .display_onEditing {
        display: block !important;
      }
      .hidden_onEditing {
        display: none !important;
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
          // color: #ccc;
          color: #82a8b7;
          &.deleteIcon {
            color: #e81d1d;
          }
        }
      }
    }
  }

  .lineBox {
    display: none;
    height: 0;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0px;
    border-bottom: 0px solid #529393;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    transition: color,border-color 0.3s ease-in;
    &:hover {
      display: block;
      bottom: -5px;
      border-bottom: 10px solid #02c0ff;
      .insertBtn {
        color: #02c0ff !important;
        bottom: 10px;
      }
    }
  }

  .insertBtn {
    position: absolute;
    right: 4px;
    width: 20px;
    height: 20px;
    bottom: 15px;
  }

  #rowId div.lineBox_onHover:hover + .rowClasses {
    // border: 3px solid #00b7ff;
    border-bottom: 5px solid #00a1d6 !important;
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
  onInputValueChange,
  displayIndex
}) => {
  const hiddenOnEditing = "hidden_onEditing";
  const displayOnEditing = ["editing_default_hidden", "display_onEditing"].join(
    " "
  );
  //取消浏览器的双击选中 使用了css代替
  // document.onselectstart = function() {
  //   return false;
  // };
  return (
    <RowWrap>
      <div
        key={index}
        style={style}
        className={[
          className,
          "rowClasses",
          index % 2 ? "odd" : "",
          sub.editing ? "onEditing" : ""
        ].join(" ")}
        onDoubleClick={() => onRowEdit(sub)}
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
            className="fa fa-times deleteIcon"
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
          <span className={`${displayOnEditing}`}>{editingSub.length}</span>
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
          <span
            style={{ display: displayIndex ? "block" : "none" }}
            className={`${hiddenOnEditing}`}
          >
            {index}
          </span>
          <i
            onClick={() => onRowCancel(sub)}
            className={`fa fa-reply ${displayOnEditing}`}
            title="取消编辑"
          ></i>
          <div
            className={`${hiddenOnEditing} lineBox `}
            style={{ display: displayIndex ? "none" : "block" }}
          >
            <i className={`fa fa-plus-square  insertBtn`} title="插入字幕"></i>
          </div>
        </div>
      </div>
    </RowWrap>
  );
};

export default SubRow;
