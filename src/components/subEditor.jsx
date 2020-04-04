import React, { Component } from "react";
import Header from "./header";
import styled, { createGlobalStyle } from "styled-components";
import SubTable from "./subTable";
import VideoPlayer from "./videoPlayer";
import Timeline from "./timeline";
import logger from "../utils/logger";
import subService from "../services/subService";
import notifier from "../utils/notifier";
import videoService from "../services/videoService";

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
    // https://sh-rep.oss-cn-hongkong.aliyuncs.com/mll.mp4   /friday.mp4
    videoUrl: "",
    subUrl: "",
    subArray: [],
    picUrl: videoService.getDefaultPicUrl(),
    //容器 装着SubTab 和 VideoPlayer
    container: {
      containerHeight: 10,
      containerWidth: 10,
    },
    //当前选中的字幕
    //播放器
    player: null,
  };

  subUrlWorker = subService.createSubUrlWorker();

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
  updateOneState = (stateObject) => {
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
  storageSubs = (subArray) => {
    subService.saveSubArray(subArray);
  };

  //清空存储里的字幕
  cleanStorageSubs = () => {
    subService.cleanSubArray();
    logger.clog("清空存储的字幕");
  };

  //删除一行字幕
  handleSubRemove = (sub) => {
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
  handleSubEdit = (sub) => {
    const subArray = [...this.state.subArray];
    //将数组内每个sub的editing重置
    subArray.map((sub) => (sub.editing = false));
    const index = subArray.indexOf(sub);
    subArray[index].editing = true;
    this.setState({ subArray });
    logger.clog("handleEdit", sub, index);
  };

  //取消时
  handleSubCancel = (sub) => {
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

  //插入默认字幕
  handleSubInsert = (sub) => {
    // 要对字幕排序
    //起始时间 有参考的sub 就是 sub的结束时间 +0.001 ， 没有sub 就是0
    let start = sub ? sub.end + 0.001 : 0;
    //复制字幕数组
    const subArray = [...this.state.subArray];
    //如果sub为空 index为-1
    let index = subArray.indexOf(sub);
    //sub的下一个sub对象 next
    const next = subArray[index + 1];
    //结束时间 有next元素就是next元素的起始时间 -0.001 ， 没有next 就是起始时间+5
    let end = next ? Math.abs(next.start - 0.001) : start + 5;
    //判断得到的时长是否合理
    if (Number((end - start).toFixed(3)) < 0.001) {
      notifier.notify("空间不足，前后字幕相隔至少需要0.03秒");
      return;
    }
    //根据开始和结束时间 获得一个默认字幕
    const dSub = subService.getDefaultSub(Number(start), Number(end));
    //将字幕插入到指定位置
    subArray.splice(index + 1, 0, dSub);
    //更新
    this.setState({ subArray });
    logger.clog("插入：", dSub);
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
      //释放这个字幕的url资源
      URL.revokeObjectURL(this.state.subUrl);
    }
  };

  //切换视频
  handleVideoSwitch = (fileType, videoUrl) => {
    const videoType = videoService.createVideoType(fileType);
    //释放前一个视频资源
    URL.revokeObjectURL(this.state.videoUrl);
    //更新视频url
    this.setState({ videoUrl });
    this.state.player.switchVideo({
      url: videoUrl,
      type: videoType,
    });
  };

  //视频可播放时
  handleVideoCanPlay = () => {
    //通知worker 临时测试用 ， 正式使用worker时 需要在每次subArray改变后回调
    this.subUrlWorker.postMessage(this.state.subArray);
    //设置收到worker回复时的处理
    this.subUrlWorker.onmessage = (event) => {
      const subUrl = event.data;
      //没找到dbplayer切换字幕的函数
      logger.clog("找track", this.state.player.video);
      const track = this.state.player.video.firstElementChild;
      track.src = subUrl;
      //更新记录的字幕url
      this.setState({ subUrl });
    };
  };

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
      onCancel: this.handleSubCancel,
      onInsert: this.handleSubInsert,
      onSwitch: this.handleVideoSwitch,
      onVideoCanPlay: this.handleVideoCanPlay,
    };

    return (
      <React.Fragment>
        <GlobalStyle />
        <Header {...props} />
        <Main>
          <VideoPlayer {...props} />
          <SubTable {...props} />
        </Main>
        <Timeline />
      </React.Fragment>
    );
  }
}

export default SubEditor;
