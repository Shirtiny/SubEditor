import React from "react";
import styled from "styled-components";
import Input from "./common/input";

const RowWrap = styled.div`
  .rowClasses {
    background-color: #f2f2f2;
    // border-bottom: 1px solid rgb(36, 41, 45);
    min-width: 650px;
    transition: all 0.15s ease;

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
            color: #f5f239;
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
    border-bottom: 0px dashed #529393;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    transition: color, border-color 0.3s ease-in-out;
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

  //当scroll滚到当前row row的动画
  .scrollToRowAnimation {
    animation: scrollToRowAnimation 3s;
    //播放次数无限制
    // animation-iteration-count: infinite;
  }

  .scrollIndexBackColor {
    transition: background-color 0.5s ease-in;
    background-color: #04e8e8 !important;
    &:hover {
      color: black;
    }
  }
`;
//单击次数 用来区分双击和单击 解决onDoubleClick时触发onclick的问题
let clickCount = 0;

const SubRow = ({
  index,
  style,
  className,
  rowData: sub,
  onRowRemove,
  onRowEdit,
  onRowClick,
  onRowCommit,
  onRowCancel,
  onRowInsert,
  editingIndex,
  editingSub,
  errors,
  onInputValueChange,
  displayIndex,
  scrollIndex,
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
          editingIndex === index ? "onEditing" : "",
          scrollIndex === index ? "scrollIndexBackColor" : "",
        ].join(" ")}
        onClick={() => {
          clickCount += 1;
          setTimeout(() => {
            if (clickCount === 1) {
              onRowClick(sub);
            } else if (clickCount === 2) {
              onRowEdit(sub);
            }
            //重置count
            clickCount = 0;
          }, 200);
        }}
        onKeyUp={(e) => {
          e.preventDefault();
          //阻止事件进一步传播
          e.stopPropagation();
          switch (e.keyCode) {
            //回车 提交
            case 13:
              onRowCommit(sub);
              break;
            //Esc 取消编辑
            case 27:
              onRowCancel();
              break;
            default:
              return;
          }
        }}
      >
        {/* 操作按钮 */}
        <div className="rowT operation" style={{ width: 90 }}>
          <i
            onClick={(e) => {
              e.stopPropagation();
              onRowEdit(sub);
            }}
            className={`fa fa-pencil ${hiddenOnEditing}`}
            title="编辑"
          ></i>
          <i
            onClick={(e) => {
              e.stopPropagation();
              onRowCommit(sub);
            }}
            className={`fa fa-check-circle-o ${displayOnEditing}`}
            title="保存"
          ></i>
          <i
            className="fa fa-times deleteIcon"
            onClick={(e) => {
              e.stopPropagation();
              onRowRemove(sub, index);
            }}
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
        {/* 序号 ， 取消按钮 ， 插入按钮*/}
        <div className="rowT operation" style={{ width: 50 }}>
          <span
            style={{ display: displayIndex ? "block" : "none" }}
            className={`${hiddenOnEditing}`}
          >
            {index}
          </span>
          <i
            onClick={(e) => {
              //阻止事件传播 （阻止传给父元素
              e.stopPropagation();
              onRowCancel(sub);
            }}
            className={`fa fa-reply ${displayOnEditing}`}
            title="取消编辑"
          ></i>
          <div
            className={`${hiddenOnEditing} lineBox `}
            style={{ display: displayIndex ? "none" : "block" }}
          >
            <i
              className={`fa fa-plus-square  insertBtn`}
              title="插入字幕"
              onClick={(e) => {
                e.stopPropagation();
                onRowInsert(sub);
              }}
            ></i>
          </div>
        </div>
      </div>
    </RowWrap>
  );
};

export default SubRow;
