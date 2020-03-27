import React, { Component } from "react";
import { Table } from "react-virtualized";
import styled from "styled-components";
import SubRow from "./subRow";
import SubHeaderRow from "./subHeaderRow";
import subService from "../services/subService";
import validateService from "../services/validateService";
import logger from "../utils/logger";

const TableWrapper = styled.div`
  flex: 1;
  margin-top: 5px;
  .ReactVirtualized__Table {
    font-size: 12px;
    background: #e3eeee;
    // background: #c0d9d9; root背景色

    .ReactVirtualized__Table__Grid {
      outline: none;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      min-width: 650px;

      .ReactVirtualized__Grid__innerScrollContainer {
        min-width: 650px;
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
`;

class SubTable extends Component {
  //没用到
  $tableRef = React.createRef();

  state = {
    //当前正在编辑的字幕信息
    editingSub: {
      start: 0,
      startTime: "",
      end: 0,
      endTime: "",
      length: 0,
      content: ""
    },
    errors: {}
  };

  //校验规则
  schema = validateService.getEditingSubSchema();

  //全表单校验
  validate = () => {
    //执行校验
    const result = validateService.validate(this.state.editingSub, this.schema);
    logger.clog("editingSub校验结果，出现的错误：", result);
    //无错误 暂时返回true 表示通过校验
    if (!result) return true;
    //有错误 则给state的errors对象赋值 明天做
  };

  //得到input的值 更新state
  handleInputValue = (name, value) => {
    const editingSub = { ...this.state.editingSub };
    editingSub[name] = value;
    this.setState({ editingSub }, () => {
      logger.clog("更新input：", name, value, this.state.editingSub);
    });
  };

  //在编辑时 回显表单数据
  handleRowEdit = sub => {
    const { onEdit } = this.props;
    const editingSub = subService.mapSubToFullModel(sub);
    this.setState({ editingSub }, () => {
      logger.clog("表单回显：", this.state.editingSub);
    });
    onEdit(sub);
  };

  //提交前
  handleRowCommit = sub => {
    const { onCommit } = this.props;
    //校验全表单数据
    this.validate();
    logger.clog("表单提交：", sub);
    onCommit(sub);
  };

  handleRowRemove = sub => {
    const { onRemove } = this.props;
    logger.clog("删除一行：", sub);
    onRemove(sub);
  };

  //改变table的背景色 ，ps： table被header 和 grid覆盖
  tableBackGroundColor = subArray => {
    const color = subArray && subArray.length === 0 ? "#e3eeee" : "#c0d9d9";
    let $table = document.getElementById("vSubTable");
    if ($table) {
      $table.style.backgroundColor = color;
    }
  };

  render() {
    const { subArray, container } = this.props;
    const { containerHeight, containerWidth } = container;
    //table背景色 无内容时为银色 有内容和root背景一样
    this.tableBackGroundColor(subArray);
    return (
      <TableWrapper>
        <Table
          id="vSubTable"
          ref={this.$tableRef}
          headerHeight={35}
          width={containerWidth / 2}
          height={containerHeight}
          rowHeight={60}
          // scrollToIndex={currentIndex}
          rowCount={subArray.length}
          rowGetter={({ index }) => subArray[index]}
          headerRowRenderer={() => <SubHeaderRow />}
          rowRenderer={rowProps => (
            <SubRow
              {...rowProps}
              onRowRemove={this.handleRowRemove}
              onRowEdit={this.handleRowEdit}
              onRowCommit={this.handleRowCommit}
              onInputValueChange={this.handleInputValue}
              {...this.state}
            />
          )}
        ></Table>
      </TableWrapper>
    );
  }
}

export default SubTable;
