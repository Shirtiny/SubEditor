import React, { Component } from "react";
import { Table } from "react-virtualized";
import styled from "styled-components";
import SubRow from "./subRow";
import SubHeaderRow from "./subHeaderRow";
import subService from "../services/subService";
import validateService from "../services/validateService";
import logger from "../utils/logger";
import notifier from "../utils/notifier";
import BootstrapToast from "./common/bootstrapToast";

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
  schema = {};

  //错误信息模版
  errorSchema = {};

  componentDidMount() {
    //初始化校验规则 、 错误信息模版 、变量名
    this.schema = validateService.getEditingSubSchema();
    this.errorSchema = validateService.getEditingErrorSchema();
  }

  //全表单校验
  validate = () => {
    //执行校验
    const errorPaths = validateService.validate(
      this.state.editingSub,
      this.schema
    );
    //无错误 返回false 表示通过校验 无错误对象
    if (!errorPaths) {
      //更新state为空
      this.setState({ errors: {} });
      return false;
    }
    let errors = {};
    errorPaths.map(path => (errors[path] = this.errorSchema[path]));
    //更新state
    this.setState({ errors });
    //返回错误对象
    return errors;
  };

  //单属性校验
  validateProperty = (name, value) => {
    const schema = {
      [name]: this.schema[name]
    };
    // 校验无错返回false 有错返回true
    const flag = validateService.validateProperty(name, value, schema);
    //拿到原errors的值
    let errors = { ...this.state.errors };
    // 有错  添加或修改errors的属性 返回新建errors, 无错 删除errors的属性 返回false
    if (flag) {
      errors[name] = this.errorSchema[name];
      //更新 state
      this.setState({ errors });
      //返回错误对象
      let error = { [name]: this.errorSchema[name] };
      return error;
    } else {
      //无错 则清掉原state里errors对象的相应属性
      delete errors[name];
      //更新 state
      this.setState({ errors });
      //返回false
      return false;
    }
  };

  //得到input的值 更新state
  handleInputValue = (name, value) => {
    const editingSub = { ...this.state.editingSub };
    editingSub[name] = value;
    this.setState({ editingSub }, () => {
      // logger.clog("更新input：", name, value, this.state.editingSub);
    });
    const error = this.validateProperty(name, value);
    if (error) {
      let errorMessage = validateService.errors2messages(error);
      notifier.notify(errorMessage.length > 0 && errorMessage[0], "top_left");
    }
  };

  //在编辑时 回显表单数据 校验数据以更新errors
  handleRowEdit = sub => {
    const { onEdit } = this.props;
    const editingSub = subService.mapSubToFullModel(sub);
    this.setState({ editingSub }, () => {
      //校验数据 更新errors
      this.validate();
      logger.clog("表单回显：", this.state.editingSub);
    });
    onEdit(sub);
  };

  //提交前
  handleRowCommit = sub => {
    const { onCommit } = this.props;
    //校验全表单数据
    const errors = this.validate();
    //有错误 则不提交
    if (errors) {
      const errorMessages = validateService.errors2messages(errors);
      //打出提示
      notifier.notify(
        <BootstrapToast
          head="请检查输入格式"
          dataArray={errorMessages}
          type="warning"
        />,
        "top_left"
      );
      return;
    }
    onCommit(sub);
  };

  handleRowRemove = sub => {
    const { onRemove } = this.props;
    logger.clog("删除一行：", sub);
    onRemove(sub);
  };

  //取消编辑
  handleRowCancel = sub => {
    const { onCancel } = this.props;
    logger.clog("取消编辑：", sub);
    onCancel(sub);
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
              onRowCancel={this.handleRowCancel}
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
