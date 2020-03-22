import React, { Component } from "react";
import { Table } from "react-virtualized";
import styled from "styled-components";
import SubRow from "./subRow";

const Wrapper = styled.div`
  //   flex: 1;
  border-right: 1px solid rgb(10, 10, 10);
  .ReactVirtualized__Table {
    font-size: 12px;
    background: #526c6c;

    .ReactVirtualized__Table__Grid {
      outline: none;
    }

    .ReactVirtualized__Table__headerRow {
      background: #1c2022;
      border-bottom: 1px solid rgb(10, 10, 10);

      .rowT {
        padding: 10px 5px;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        text-align: center;
        text-transform: none;
      }
    }

    .ReactVirtualized__Table__row {
      background-color: #294242;
      border-bottom: 1px solid rgb(36, 41, 45);
      transition: all 0.2s ease;

      &.odd {
        background-color: #1c2022;
      }

      &.highlight {
        color: #fff;
        background-color: #2196f3;
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
      }

      &.illegal {
        color: #fff;
        background-color: #c75123;
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
      }

      .rowT {
        padding: 10px 5px;
        text-align: center;
      }
    }

    .input,
    .textarea {
      border: none;
      padding: 5px;
      min-height: 30px;
      font-size: 12px;
      text-align: center;
      color: #fff;
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
  render() {
    const { subArray, containerHeight, containerWidth } = this.props;

    return (
      <Wrapper>
        <Table
          headerHeight={40}
          width={containerWidth / 2}
          height={containerHeight}
          rowHeight={60}
          // scrollToIndex={currentIndex}
          rowCount={subArray.length}
          rowGetter={({ index }) => subArray[index]}
          headerRowRenderer={() => {
            return (
              <div className="ReactVirtualized__Table__headerRow">
                <div className="rowT" style={{ width: 50 }}>
                  #
                </div>
                <div className="rowT" style={{ width: 100 }}>
                  开始
                </div>
                <div className="rowT" style={{ width: 100 }}>
                  结束
                </div>
                <div className="rowT" style={{ width: 100 }}>
                  时长
                </div>
                <div className="rowT" style={{ flex: 1 }}>
                  文本
                </div>
                <div className="rowT" style={{ width: 90 }}>
                  操作
                </div>
              </div>
            );
          }}
          rowRenderer={props => {
            return <SubRow {...props} />;
          }}
        ></Table>
      </Wrapper>
    );
  }
}

export default SubTable;
