import React, { PureComponent } from "react";
import { Table } from "react-virtualized";
import styled from "styled-components";
import SubRow from "./subRow";
import SubHeaderRow from "./subHeaderRow";
import subService from "../services/subService";
import validateService from "../services/validateService";
import logger from "../utils/logger";
import notifier from "../utils/notifier";
import lihuaMikuPng from "../resources/image/lihuaMiku.png";

const TableWrapper = styled.div`
  height: 100%;
  .ReactVirtualized__Table {
    font-size: 12px;
    background: #e3eeee;
    // background: #c0d9d9; root背景色

    .ReactVirtualized__Table__Grid {
      outline: none;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
      border-radius: 0.5rem;
      min-width: 650px;
      background-color: #e3eeee;
      background-image: url(${lihuaMikuPng});
      background-repeat: no-repeat;
      background-position: 98% 98%;

      .ReactVirtualized__Grid__innerScrollContainer {
        min-width: 650px;
      }
    }

    .gridScrollWrap {
      overflow: hidden !important;
      :hover {
        overflow-y: scroll !important;

        // fireFox
        scrollbar-color: #6fd1d8 #fff;
        // scrollbar-color: light;
        scrollbar-width: thin;
        // scrollbar-width: none;

        //Safari and Chrome
        ::-webkit-scrollbar {
          // display: none;
          width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
        }
        ::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 10px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: #6fd1d8;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          background: #fff;
        }
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

//PureComponent要注意它是浅比较 https://react.docschina.org/docs/optimizing-performance.html
class SubTable extends PureComponent {
  //没用到
  $tableRef = React.createRef();

  state = {
    //正在编辑的字幕序号
    editingIndex: -1,
    //当前正在编辑的字幕信息
    editingSub: {
      start: 0,
      startTime: "",
      end: 0,
      endTime: "",
      length: 0,
      content: "",
    },
    errors: {},
    //是否显示index true：显示序号  false: 显示插入按钮
    displayIndex: true,
  };

  //校验规则
  schema = {};

  //错误信息模版
  errorSchema = {};

  //toastId 全属性校验 提交时提示
  toastId_validate = null;

  //toastId 单属性校验 输入时提示
  toastId_validatePropertys = {
    startTime: null,
    endTime: null,
    content: null,
  };

  componentDidMount() {
    //初始化校验规则 、 错误信息模版 、变量名
    this.schema = validateService.getEditingSubSchema();
    this.errorSchema = validateService.getEditingErrorSchema();
  }

  componentDidUpdate() {
    // this.scrollToButtom();
  }

  //使用PureComponent 来代替手写shouldComponentUpdate
  // shouldComponentUpdate(nextProps, nextState) {
  //   return true;
  // }

  //全表单校验
  validate = () => {
    //执行校验
    const errorPaths = validateService.validate(
      this.state.editingSub,
      this.schema
    );
    //定义错误对象
    let errors = {};
    //如果数据格式的校验有错误
    if (errorPaths) {
      errorPaths.map((path) => (errors[path] = this.errorSchema[path]));
    }
    //特殊校验
    // ...
    //无错误 返回false 表示通过校验 无错误对象
    if (Object.keys(errors).length === 0) {
      //更新state为空
      this.setState({ errors: {} });
      return false;
    } else {
      //更新state
      this.setState({ errors });
      //返回错误对象
      return errors;
    }
  };

  //全校验提示
  toast_validate = (errorMessages) => {
    //关闭之前的提示
    notifier.done(this.toastId_validate);
    this.toastId_validate = notifier.bootstrapToast(
      errorMessages,
      "warning",
      "top_left",
      { autoClose: 10000 },
      "flip"
    );
  };

  //单属性校验
  validateProperty = (name, value) => {
    const schema = {
      [name]: this.schema[name],
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

  // 单属性校验提示
  toast_validateProperty = (name, errorMessage) => {
    //把除了自己以外的单属性提示关闭
    //先得到自己的id
    const currentId = this.toastId_validatePropertys[name];
    //得到对象内所有属性的值 返回数组
    const ids = Object.values(this.toastId_validatePropertys);
    //把currentId从 ids数组中删除
    const index = ids.indexOf(currentId);
    ids.splice(index, 1);
    //关闭 ids数组的所有值
    ids.map((id) => notifier.done(id));
    //当 currentId 没有在工作时 弹出新的提示
    if (!notifier.isActive(currentId)) {
      this.toastId_validatePropertys[name] = notifier.notify(
        errorMessage.length > 0 && errorMessage[0],
        "bottom_left",
        "default",
        {
          hideProgressBar: true,
          autoClose: 5000,
        },
        "flip"
      );
    }
  };

  //得到input的值 更新state.editingSub
  handleInputValue = (name, value) => {
    const editingSub = { ...this.state.editingSub };
    editingSub[name] = value;
    //单属性错误校验
    const error = this.validateProperty(name, value);
    //有错 则提示
    if (error) {
      let errorMessage = validateService.errors2messages(error);
      this.toast_validateProperty(name, errorMessage);
    } else {
      //无错 则关闭提示
      notifier.done(this.toastId_validatePropertys[name]);
      //更新长度
      editingSub.length = subService.getSubLength(editingSub);
    }
    //更新state
    this.setState({ editingSub }, () => {
      // logger.clog("更新input：", name, value, this.state.editingSub);
    });
  };

  //在编辑时 回显表单数据 校验数据以更新errors
  handleRowEdit = (sub) => {
    const { subArray } = this.props;
    const editingSub = subService.mapSubToFullModel(sub);
    this.setState({ editingSub }, () => {
      //校验数据 更新errors
      this.validate();
      logger.clog("表单回显：", this.state.editingSub);
    });
    // onEdit(sub);
    const editingIndex = subArray.indexOf(sub);
    this.setState({ editingIndex });
  };

  handleRowClick = (sub) => {
    const { onClick } = this.props;
    onClick(sub);
  };

  //提交前
  handleRowCommit = (sub) => {
    const { onCommit } = this.props;
    //校验全表单数据
    const errors = this.validate();
    //有错误 则不提交
    if (errors) {
      const errorMessages = validateService.errors2messages(errors);
      //打出提示
      this.toast_validate(errorMessages);
      return;
    } else {
      //无错 则关闭提示
      notifier.done(this.toast_validate);
      //取消编辑状态
      this.handleRowCancel();
      //提交 传入原sub 和 填写的sub， 传值前将填写的sub格式化
      onCommit(sub, subService.mapSubToFullModel(this.state.editingSub));
    }
  };

  handleRowRemove = (sub, index) => {
    const { onRemove } = this.props;
    if (index === this.state.editingIndex) this.handleRowCancel();
    onRemove(sub);
  };

  //取消编辑
  handleRowCancel = () => {
    const editingIndex = -1;
    this.setState({ editingIndex });
  };

  //改变table的背景色 ，ps： table被header 和 grid覆盖
  tableBackGroundColor = (subArray) => {
    const color = subArray && subArray.length === 0 ? "#e3eeee" : "#c0d9d9";
    let $table = document.getElementById("vSubTable");
    if ($table) {
      $table.style.backgroundColor = color;
    }
  };

  //序号显示 的切换
  handleDisplayIndexSwitch = (boolean) => {
    const displayIndex = boolean ? true : false;
    this.setState({ displayIndex });
  };

  //插入
  handleRowInsert = (sub) => {
    const { onInsert } = this.props;
    onInsert(sub);
  };

  //将grid的滚动条 滚到底部
  scrollToButtom = () => {
    //移动滚条到底部 固定移动一格更好？
    const scrollWrap = document.getElementsByClassName("gridScrollWrap")[0];
    let scrollTop = scrollWrap.scrollTop;
    let scrollHeight = scrollWrap.scrollHeight;
    let clientHeight = scrollWrap.clientHeight;
    console.log(
      scrollWrap,
      "scrollHeight:",
      scrollHeight,
      ";scrollTop:",
      scrollTop,
      ";clientHeight:",
      clientHeight,
      ";scrollHeight - scrollTop - clientHeight:",
      scrollHeight - scrollTop - clientHeight
    );
    //开始移动
    scrollWrap.scrollTop =
      scrollWrap.scrollTop + (scrollHeight - scrollTop - clientHeight);
  };

  render() {
    const { subArray, scrollIndex, container, onInsert } = this.props;
    const { containerHeight, containerWidth } = container;
    //table背景色 无内容时为银色 有内容和root背景一样
    this.tableBackGroundColor(subArray);
    return (
      <TableWrapper
        onKeyUp={(e) => {
          e.preventDefault();
          //阻止事件进一步传播
          e.stopPropagation();
          switch (e.keyCode) {
            //Esc 取消编辑
            case 27:
              this.handleRowCancel();
              break;
            default:
              return;
          }
        }}
      >
        <Table
          id="vSubTable"
          ref={this.$tableRef}
          headerHeight={55}
          width={containerWidth / 2}
          height={containerHeight}
          gridClassName={"gridScrollWrap"}
          rowHeight={60}
          scrollToIndex={scrollIndex}
          rowCount={subArray.length}
          rowGetter={({ index }) => subArray[index]}
          headerRowRenderer={() => (
            <SubHeaderRow
              {...this.state}
              subArrayLenIsZero={subArray && subArray.length === 0}
              onInsert={onInsert}
              onDisplayIndexSwitch={this.handleDisplayIndexSwitch}
            />
          )}
          rowRenderer={(rowProps) => (
            <SubRow
              {...rowProps}
              onRowRemove={this.handleRowRemove}
              onRowEdit={this.handleRowEdit}
              onRowClick={this.handleRowClick}
              onRowCommit={this.handleRowCommit}
              onRowCancel={this.handleRowCancel}
              onRowInsert={this.handleRowInsert}
              onInputValueChange={this.handleInputValue}
              {...this.state}
              scrollIndex={scrollIndex}
            />
          )}
        ></Table>
      </TableWrapper>
    );
  }
}

export default SubTable;
