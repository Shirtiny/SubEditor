import React, { Component } from "react";
import Header from "./header";
import styled, { createGlobalStyle } from "styled-components";
import SubTable from "./subTable";
import VideoPlayer from "./videoPlayer";
import Timeline from "./timeline";
import logger from "../utils/logger";
import subService from "../services/subService";
import notifier from "../utils/notifier";

const GlobalStyle = createGlobalStyle`
    html,
    body,
    #root {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;
        line-height: 1.5;
        height: 100%;
        overflow: hidden;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    #root {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        // color: #ccc; 白字
        background: #C0D9D9;
        // background: #66CCCC;
    }

    #nprogress .bar {
        top: 50px !important;

        .peg {
            display: none !important;
        }
    }

    ::-webkit-scrollbar {
        width: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        background-color: #666;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background-color: #ccc;
    }
`;

const Main = styled.div`
  position: relative;
  display: flex;
  flex: 1;
`;

class SubEditor extends Component {
  state = {
    videoUrl: "",
    subUrl: "",
    subArray: [],
    //容器 装着SubTab 和 VideoPlayer
    container: {
      containerHeight: 10,
      containerWidth: 10
    }
    //当前选中的字幕
  };

  //组件装载并渲染完成后
  componentDidMount() {
    //首次调整container的宽高
    this.resizeContainer();
    //添加resize的事件监听
    this.addResizeListener();
    //初始化字幕表
    this.initSubTable();
  }

  //卸载组件前
  componentWillUnmount() {
    //移除添加的事件监听 不然页面切换多了会可能卡顿 ??
    // window.removeEventListener("resize", this.resizeContainer);
    // logger.clog("移除resize事件监听");
  }

  //调整container的宽高
  resizeContainer = () => {
    //减去导航栏的50 底部时间轴的150
    const containerHeight = document.body.clientHeight - 200;
    const containerWidth = document.body.clientWidth;
    logger.clog("更新container的宽高", containerWidth, containerHeight);
    this.setState({ container: { containerHeight, containerWidth } });
  };

  //添加resize事件监听
  addResizeListener = () => {
    //把this.resizeContainer的引用作为参数 传到匿名函数内的setTimeout内
    function debounce(func, wait) {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
      };
    }
    //300ms内只执行一次的调整
    const timeOutResize = debounce(this.resizeContainer, 300);
    //添加resize事件监听 窗口大小变化时自动执行this.resizeContainer
    window.addEventListener("resize", timeOutResize);
    logger.clog("添加resize事件监听");
  };

  //更新一个属性 供子组件回调
  updateOneState = stateObject => {
    this.setState(stateObject);
    logger.clog("更新state：", stateObject);
  };

  //初始化字幕表
  initSubTable = async () => {
    try {
      const subArray = await subService.getSubArray();
      logger.clog("初始化字幕", subArray);
      this.setState({ subArray });
    } catch (e) {
      notifier.notify("读取字幕失败，请尝试清除缓存", "top_center", "info");
    }
  };

  //存储字幕数组到本地
  storageSubs = subArray => {
    subService.saveSubArray(subArray);
  };

  //清空存储里的字幕
  cleanStorageSubs = () => {
    subService.cleanSubArray();
    logger.clog("清空存储的字幕");
  };

  //删除一行字幕
  handleSubRemove = sub => {
    const subArray = [...this.state.subArray];
    const index = subArray.indexOf(sub);
    subArray.splice(index, 1);
    //更新state 以及回调函数 ()=>{}回调函数里的this.state是更新后的state 函数无参
    this.setState({ subArray }, () => {
      this.storageSubs(this.state.subArray);
    });
    logger.clog("删除", sub, index);
  };

  //编辑时
  handleSubEdit = sub => {
    const subArray = [...this.state.subArray];
    //将数组内每个sub的editing重置
    subArray.map(sub => (sub.editing = false));
    const index = subArray.indexOf(sub);
    subArray[index].editing = true;
    this.setState({ subArray });
    logger.clog("handleEdit", sub, index);
  };

  //取消时
  handleSubCancel = sub => {
    //取消编辑状态
    const subArray = [...this.state.subArray];
    const index = subArray.indexOf(sub);
    subArray[index].editing = false;
    this.setState({ subArray });
  };

  //提交时
  handleSubCommit = (sub, editingSub) => {
    const subArray = [...this.state.subArray];
    //找到原sub的index
    const index = subArray.indexOf(sub);
    //覆盖原来的sub
    subArray[index] = editingSub;
    //取消编辑状态
    subArray[index].editing = false;
    //提交
    //更新state 以及回调函数 ()=>{}回调函数里的this.state是更新后的state 函数无参
    this.setState({ subArray }, () => {
      this.storageSubs(this.state.subArray);
    });
    logger.clog("提交：", sub, editingSub, subArray);
  };

  //下载字幕
  handleSubDownload = async () => {
    try {
      const isSuccess = await subService.downloadSubFile();
      logger.clog(isSuccess);
      if (!isSuccess) notifier.notify("无字幕文件，请先制作您的字幕。");
    } catch (e) {
      notifier.notify("下载出错", "top_center", "warning");
    }
  };

  //清空字幕 删除存储的字幕 清空内存里的字幕
  handleSubClean = () => {
    //确认框
    const isConfirm = window.confirm("是否要删除所有字幕？");
    if (isConfirm) {
      //从存储中移除
      this.cleanStorageSubs();
      //重置为空数组
      this.setState({ subArray: [] });
    }
  };

  //增加一行字幕

  render() {
    const props = {
      ...this.state,
      updateOneState: this.updateOneState,
      storageSubs: this.storageSubs,
      cleanStorageSubs: this.cleanStorageSubs,
      onDownload: this.handleSubDownload,
      onClean: this.handleSubClean,
      onRemove: this.handleSubRemove,
      onEdit: this.handleSubEdit,
      onCommit: this.handleSubCommit,
      onCancel: this.handleSubCancel
    };

    return (
      <React.Fragment>
        <GlobalStyle />
        <Header {...props} />
        <Main>
          <VideoPlayer />
          <SubTable {...props} />
        </Main>
        <Timeline />
      </React.Fragment>
    );
  }
}

export default SubEditor;
