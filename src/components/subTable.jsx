import React, { Component } from "react";
import { Table } from "react-virtualized";
import styled from "styled-components";
import SubRow from "./subRow";

const tableBackGroundColor = subArray => {
  return subArray ? "#c0d9d9" : "#e3eeee";
};

const TableWrapper = styled.div`
  flex: 1;
  margin-top: 5px;
  .ReactVirtualized__Table {
    font-size: 12px;
    background: ${tableBackGroundColor};
    // background: #e3eeee;
    // background: #c0d9d9; root背景色

    .ReactVirtualized__Table__Grid {
      outline: none;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
    }

    .ReactVirtualized__Table__headerRow {
      background: #c0d9d9;
      display: flex;

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

        &:hover {
          color: #fff;
          background-color: #43d7d7;
          span {
            display: block;
          }
        }
      }
    }

    .ReactVirtualized__Table__row {
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
      }
    }

    .input,
    .textarea {
      border: none;
      padding: 5px;
      min-height: 30px;
      font-size: 12px;
      text-align: center;
      background-color: #3a3a3a;
    }

    .textarea {
      resize: vertical;
    }

    p {
      line-height: 1.5;
      margin: 0;
    }
  }

  .operation {
    display: flex;
    justify-content: center;

    i {
      width: 25px;
      cursor: pointer;
      font-size: 16px;
    }
  }

  .edit {
    display: none;
    width: 100%;
    height: 100%;
  }

  .editing {
    .noedit {
      display: none;
    }

    .edit {
      display: block;
    }
  }
`;

class SubTable extends Component {
  //没用到
  $tableRef = React.createRef();

  render() {
    const { subArray, container } = this.props;
    const { containerHeight, containerWidth } = container;
    //table背景色 无内容时为银色 有内容和root背景一样
    tableBackGroundColor(subArray);
    return (
      <TableWrapper>
        <Table
          ref={this.$tableRef}
          headerHeight={35}
          width={containerWidth / 2}
          height={containerHeight}
          rowHeight={60}
          // scrollToIndex={currentIndex}
          rowCount={subArray.length}
          rowGetter={({ index }) => subArray[index]}
          headerRowRenderer={() => {
            return (
              <div className="ReactVirtualized__Table__headerRow">
                <div className="rowT" style={{ width: 100 }}>
                  <span className="buttonLike">
                    <i className="fa fa-pencil" aria-hidden="true"></i>编辑
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
                    {" "}
                    <i className="fa fa-text-width" aria-hidden="true"></i>文本
                  </span>
                </div>
                <div className="rowT" style={{ width: 50 }}>
                  <span className="buttonLike fa fa-sort-amount-asc"></span>
                </div>
              </div>
            );
          }}
          rowRenderer={props => {
            return <SubRow {...props} />;
          }}
        ></Table>
      </TableWrapper>
    );
  }
}

export default SubTable;
