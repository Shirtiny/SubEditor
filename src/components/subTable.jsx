import React, { Component } from "react";
import { Table } from "react-virtualized";
import styled from "styled-components";

const Wrapper = styled.div`
  //   flex: 1;
  border-right: 1px solid rgb(10, 10, 10);
  .ReactVirtualized__Table {
    font-size: 12px;
    background: #24292d;

    .ReactVirtualized__Table__Grid {
      outline: none;
    }

    .ReactVirtualized__Table__headerRow {
      background: rgb(46, 54, 60);
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
      background-color: #1c2022;
      border-bottom: 1px solid rgb(36, 41, 45);
      transition: all 0.2s ease;

      &.odd {
        background-color: rgb(46, 54, 60);
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
  state = {
    mainH: 100,
    mainW: 100
  };
  render() {
    const { subArray } = this.props;
    const { mainH, mainW } = this.state;
    return (
      <Wrapper>
        <Table
          headerHeight={40}
          width={300}
          height={500}
          rowHeight={60}
          // scrollToIndex={currentIndex}
          rowCount={subArray.length}
          rowGetter={({ index }) => subArray[index]}
          headerRowRenderer={() => {
            return (
              <div className="ReactVirtualized__Table__headerRow">
                <div className="rowT">#</div>
                <div className="rowT">开始</div>
                <div className="rowT">结束</div>
                <div className="rowT">时长</div>
                <div className="rowT">文本</div>
                <div className="rowT">操作</div>
              </div>
            );
          }}
        ></Table>
      </Wrapper>
    );
  }
}

export default SubTable;
