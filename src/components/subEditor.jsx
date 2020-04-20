import React, { Component } from "react";
import Header from "./header";
import styled, { createGlobalStyle } from "styled-components";
import SubTable from "./subTable";
import VideoPlayer from "./videoPlayer";
// import Timeline from "./timeline";
import logger from "../utils/logger";
import subService from "../services/subService";
import notifier from "../utils/notifier";
import videoService from "../services/videoService";
import WaveLine from "./waveLine";

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

const requestAnimationFrameCom =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

//导航栏50px 底部时间轴150px
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
    //字幕表滚动到的index
    scrollIndex: 0,
    //播放器
    player: null,
    //当前时间
    currentTime: 0,
  };

  //用来加工字幕url的worker
  subUrlWorker = null;

  //组件装载并渲染完成后
  componentDidMount() {
    //首次调整container的宽高
    this.resizeContainer();
    //添加resize的事件监听
    this.addResizeListener();
    //初始化字幕表
    this.initSubTable();
    //设置 收到worker回复时的处理
    this.subUrlWorker = subService.createSubUrlWorker((subUrl) => {
      //拿到url后 更新并装载
      this.updateSubUrl(subUrl, true);
    });
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

  /**@description 更新字幕数组
   * @param {array} subArray 字幕数组
   * @param {boolean} willStorage 是否存储
   */
  updateSubArray = (subArray, willStorage = false) => {
    // 将字幕数组转为规范模式
    subArray.map((sub) => subService.mapSubToFullModel(sub));
    //排序
    const sortedArray = subService.sortSubArray(subArray);
    this.setState({ subArray: sortedArray }, () => {
      // 回调函数 ()=>{}回调函数里的this.state是更新后的state 函数无参
      //如果不需要存储的更新 则结束
      if (!willStorage) return;
      //存储字幕
      this.storageSubs(this.state.subArray);
      // 交给worker前 需要将字幕数组转为规范模式 前面已经转过了
      this.subUrlWorker.postMessage(this.state.subArray);
    });
  };

  /**@description 更新字幕url
   * @param {string} subUrl 字幕url
   * @param {boolean} willLoadTrack 是否载入字幕给track
   */
  updateSubUrl = (subUrl, willLoadTrack = false) => {
    //释放上一个url资源
    URL.revokeObjectURL(this.state.subUrl);
    logger.clog("释放：", this.state.subUrl);
    this.setState({ subUrl }, () => {
      //如果需要载入字幕
      if (willLoadTrack) {
        logger.clog("装载：", this.state.subUrl);
        //装载字幕
        this.loadTrack(this.state.subUrl);
      }
    });
  };

  //为播放器装载字幕
  loadTrack = (subUrl) => {
    //清除播放器中已经渲染的p标签字幕 只会渲染一行
    this.cleanSubP();
    if (!this.state.player || !this.state.player.video) return;
    //没找到dbplayer切换字幕的函数
    const track = this.state.player.video.firstElementChild;
    track.default = true;
    track.kind = "subtitles";
    track.src = subUrl;
  };

  //清除播放器残留的字幕 已经被渲染在p标签里的字幕 只会渲染一行 也只有一行
  cleanSubP = () => {
    const subtitleDiv = document.getElementsByClassName("dplayer-subtitle")[0];
    const p = subtitleDiv.firstChild;
    if (p) {
      subtitleDiv.removeChild(p);
      logger.clog("清除字幕残留", p);
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

  //初始化字幕表
  initSubTable = async () => {
    try {
      const subArray = await subService.getSubArray();
      logger.clog("从存储中，初始化字幕", subArray);
      //不需要存储
      this.updateSubArray(subArray);
      const subUrl = subService.createSubArrayUrl(subArray);
      //更新记录的字幕url 并载入字幕 这样就不需要在初始化数组的时候 再去存一遍了
      this.updateSubUrl(subUrl, true);
    } catch (e) {
      notifier.notify("读取字幕失败，请尝试清除缓存", "top_center", "info");
    }
  };

  //删除一行字幕
  handleSubRemove = (sub) => {
    const subArray = [...this.state.subArray];
    const index = subArray.indexOf(sub);
    subArray.splice(index, 1);
    //更新state 并存储 每次存储都会更新url
    this.updateSubArray(subArray, true);
    logger.clog("删除", sub, index);
  };

  //编辑时
  handleSubEdit = (sub) => {
    const subArray = [...this.state.subArray];
    //将数组内每个sub的editing重置
    subArray.map((sub) => (sub.editing = false));
    const index = subArray.indexOf(sub);
    subArray[index].editing = true;
    this.updateSubArray(subArray);
    logger.clog("handleEdit", sub, index);
  };

  //取消时
  handleSubCancel = (sub) => {
    //取消编辑状态
    const subArray = [...this.state.subArray];
    const index = subArray.indexOf(sub);
    subArray[index].editing = false;
    this.updateSubArray(subArray);
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
    //更新state 并存储 如果存储 则会更新url
    this.updateSubArray(subArray, true);
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
    this.updateSubArray(subArray);
    //将滚条滚到刚刚的位置
    const scrollIndex = index + 1;
    this.setState({ scrollIndex });
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
      //字幕url置空 并载入给track（每次更新 都会释放上一个url资源
      this.updateSubUrl("", true);
      //重置为空数组
      const subArray = [];
      this.updateSubArray(subArray);
    }
  };

  //初始化视频播放器对象
  handlePlayerInit = (player) => {
    logger.clog("初始化播放器");
    this.setState({ player });
    //1秒60帧 根据屏幕刷新虑有所变化，time为时间戳 ，每一帧的工作内容为：
    const frameWork = () => {
      const { video } = player;
      //更新当前时间
      this.handleCurrentTime(video.currentTime);
      requestAnimationFrameCom(frameWork);
    };
    //启动时间更新
    requestAnimationFrameCom(frameWork);
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

  //视频可播放时 视频准备就绪后
  handleVideoCanPlay = () => {
    logger.clog("视频已经就绪");
    const isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > 0;
    //如果是chrome 则把字幕改为透明 避免双字幕
    if (isChrome) {
      const subtitleDiv = document.getElementsByClassName(
        "dplayer-subtitle"
      )[0];
      if (subtitleDiv) {
        subtitleDiv.style.opacity = 0;
      }
    }
  };

  //更新当前时间 如果和当前保存的当前时间相等 则不更新
  handleCurrentTime = (currentTime) => {
    if (this.state.currentTime === currentTime) return;
    this.setState({ currentTime });
  };

  //在视频播放时
  handleVideoPlaying = () => {};

  //底部waveLine左键单击时 url为空时 不会执行
  handleWaveClick = (time, event) => {
    const { player } = this.state;
    if (!player) return;
    //暂停视频 然后跳转到对应time
    player.pause();
    player.seek(time);
  };

  //底部waveLine右键单击时 url为空时 不会执行
  handleWaveContextmenu = (time, event) => {
    const { player } = this.state;
    if (!player) return;
    //播放视频 然后跳转到对应time
    player.play();
    player.seek(time);
  };

  //当timeLine的字幕块移动时
  handleSubMove = (originSub, translateSecond) => {
    //这里是浅拷贝 数组内元素的引用并没有变化
    const subArray = [...this.state.subArray];
    const index = subArray.indexOf(originSub);
    const sub = subArray[index];
    const start = Number(Number(sub.start + translateSecond).toFixed(3));
    const end = Number(Number(sub.end + translateSecond).toFixed(3));
    //非法值 则不更新subArray
    if (start < 0 || end <= 0) return;
    //这里的拷贝是因为 如startTime可能为只读属性
    const tempSub = { ...sub };
    tempSub.startTime = subService.toTime(start);
    tempSub.endTime = subService.toTime(end);
    //这里返回了一个新的对象 改变了subArray[index]的内存地址 因为subTable使用的PureComponent是浅比较 所以必须要改数组内元素的内存地址
    subArray[index] = subService.mapSubToFullModel(tempSub);
    this.updateSubArray(subArray, true);
  };

  render() {
    const {
      videoUrl,
      subUrl,
      subArray,
      picUrl,
      container,
      scrollIndex,
      player,
      currentTime,
    } = this.state;
    const funcProps = {
      updateOneState: this.updateOneState,
      updateSubArray: this.updateSubArray,
      updateSubUrl: this.updateSubUrl,
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
      initPlayer: this.handlePlayerInit,
      onVideoCanPlay: this.handleVideoCanPlay,
      updateCurrentTime: this.handleCurrentTime,
      onVideoPlaying: this.handleVideoPlaying,
      onWaveClick: this.handleWaveClick,
      onWaveContextmenu: this.handleWaveContextmenu,
      onSubMove: this.handleSubMove,
    };

    return (
      <React.Fragment>
        <GlobalStyle />
        <Header {...funcProps} />
        <Main>
          <VideoPlayer
            {...funcProps}
            picUrl={picUrl}
            videoUrl={videoUrl}
            subUrl={subUrl}
            player={player}
          />
          <SubTable
            {...funcProps}
            container={container}
            subArray={subArray}
            scrollIndex={scrollIndex}
          />
        </Main>
        {/* <Timeline {...funcProps}/> */}
        <WaveLine
          {...funcProps}
          currentTime={currentTime}
          videoUrl={videoUrl}
          subArray={subArray}
        />
      </React.Fragment>
    );
  }
}

export default SubEditor;
