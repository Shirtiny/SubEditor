import React, { Component } from "react";
import { Helmet } from "react-helmet";
import _ from "lodash";
import styled, { createGlobalStyle } from "styled-components";
import subeditorIco from "../resources/image/subeditor.ico";
import subService from "../services/subService";
import videoService from "../services/videoService";
import editorStateService from "../services/editorStateService";
import config from "../config/config.json";
import SubEditorPackage from "../../package.json";
import EditorState from "../model/editorState";
import logger from "../utils/logger";
import notifier from "../utils/notifier";
import translater from "../utils/translater";
import Header from "./header";
import VideoPlayer from "./videoPlayer";
import SubTable from "./subTable";
import Tools from "./tools";
import WaveLine from "./waveLine";

const GlobalStyle = createGlobalStyle`
    html,
    body,
    #root {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;
        line-height: 1.5;
        height: 100vh;
        overflow: auto;
        min-width: 1300px;
        min-height: 800px;
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
        // overflow-y: scroll;
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

const Left = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Right = styled.div`
  flex: 1;
  padding-top: 5px;
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
    scrollIndex: -1,
    //播放器
    player: null,
    //当前时间
    currentTime: 0,
    //时间轴长度
    duration: 15,
    //播放器是否暂停
    playerPaused: true,
  };

  //用来加工字幕url的worker
  subUrlWorker = null;

  //组件装载并渲染完成后
  componentDidMount() {
    //首次调整container的宽高
    this.resizeContainer();
    //添加resize的事件监听
    this.addResizeListener();
    //添加视频控制组件的键盘监听
    this.addKeyboardListener();
    //初始化字幕表
    this.initSubTable();
    //设置 收到worker回复时的处理
    this.subUrlWorker = subService.createSubUrlWorker((subUrl) => {
      //拿到url后 更新并装载
      this.updateSubUrl(subUrl, true);
    });
  }

  //是否记录当前状态
  WillMemorize = true;

  //组件更新后 在这里记录状态
  componentDidUpdate(prevProps, prevState) {
    //如果需要记录 并且state的subArray与之前的地址不同
    if (this.WillMemorize && prevState.subArray !== this.state.subArray) {
      const editorstate = this.createEditorState();
      editorStateService.push(editorstate);
      const history = editorStateService.getHistory();
      console.log(history.length, history);
    }
  }

  //卸载组件前
  componentWillUnmount() {
    //移除添加的事件监听 不然页面切换多了会可能卡顿 ??
    // window.removeEventListener("resize", this.resizeContainer);
    // logger.clog("移除resize事件监听");
    this.removeKeyboardListener();
  }

  //调整container的宽高
  resizeContainer = () => {
    //减去导航栏的50 底部时间轴的150
    const containerHeight = document.body.clientHeight - 200;
    const containerWidth = document.body.clientWidth;
    const $main = document.querySelector("#mainContainer");
    $main.style.maxWidth = `${containerWidth}px;`;
    $main.style.maxHeight = `${containerHeight}px;`;
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

  //工具栏videoControl的快捷键
  videoControlsShortcutkey = (e) => {
    //对ctrl、alt键的up不处理
    if (e.keyCode === 17 || e.keyCode === 18) return;
    let step;
    switch (e.keyCode) {
      // Left（左箭头）
      case 37:
        step = -0.1;
        if (e.ctrlKey) step = -1;
        if (e.ctrlKey && e.altKey) step = -10;
        break;
      // Right（右箭头）
      case 39:
        step = 0.1;
        if (e.ctrlKey) step = 1;
        if (e.ctrlKey && e.altKey) step = 10;
        break;
      //Space（空格键）
      case 32:
        // step保持默认undifined即可
        break;
      default:
        return;
    }
    //阻止默认行为
    e.preventDefault();
    this.handleVideoControlActions(step);
  };

  //撤销快捷键
  undoShortcutkey = (e) => {
    let bool;
    switch (e.keyCode) {
      case 90:
        if (e.ctrlKey) bool = true;
        if (e.ctrlKey && e.shiftKey) bool = false;
        break;
      default:
        return;
    }
    if (typeof bool === "undefined") return;
    //阻止默认行为
    e.preventDefault();
    this.editorStateRollBack(bool);
  };

  //添加键盘事件监听
  addKeyboardListener = () => {
    window.addEventListener("keyup", this.videoControlsShortcutkey);
    window.addEventListener("keyup", this.undoShortcutkey);
  };

  //移除键盘事件监听
  removeKeyboardListener = () => {
    window.removeEventListener("keyup", this.videoControlsShortcutkey);
    window.removeEventListener("keyup", this.undoShortcutkey);
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
    //重置scrollIndex (需要先重置scrollIndex 再更新数组 更新数组会使wavleLine重新计算scrollIndex)
    this.setState({ scrollIndex: -1 });
    //更新subArray
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

  //存储字幕数组到本地 指明是否是备份
  storageSubs = (subArray, isBackup = false) => {
    subService.saveSubArray(subArray, isBackup);
  };

  //清空存储里的字幕 不含备份
  cleanStorageSubs = () => {
    subService.cleanSubArray();
    logger.clog("清空存储的字幕，不含备份");
  };

  //初始化字幕表
  initSubTable = async () => {
    try {
      const subArray = await subService.getSubArray();
      //初始字幕
      if (!subArray || subArray.length === 0) {
        const defaultSubUrl = videoService.getDefaultSubUrl();
        this.updateSubUrl(defaultSubUrl, true);
        const defaultSubArray = await subService.createSubArray(defaultSubUrl);
        this.updateSubArray(defaultSubArray);
        return;
      }
      //不需要存储
      this.updateSubArray(subArray);
      const subUrl = subService.createSubArrayUrl(subArray);
      //更新记录的字幕url 并载入字幕 这样就不需要在初始化数组的时候 再去存一遍了
      this.updateSubUrl(subUrl, true);
    } catch (e) {
      console.log(e);
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

  //旧 编辑时 待改 编辑状态应当在subtable
  handleSubEdit = (sub) => {
    //将数组内每个sub的editing重置
    const subArray = this.state.subArray.map((sub) => {
      return {
        ...sub,
        startTime: sub.startTime,
        endTime: sub.endTime,
        length: sub.length,
        editing: false,
      };
    });
    const index = this.state.subArray.indexOf(sub);
    subArray[index].editing = true;
    this.updateSubArray(subArray);
    logger.clog("handleEdit", sub, index);
  };

  //点击时
  handleSubClick = (sub) => {
    if (!sub || !sub.start) return;
    const time = sub.start;
    //暂停视频 然后跳转到对应time
    this.playerSeekTo(time);
  };

  //旧  取消时
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

  //初始化视频播放器对象 设置高频更新当前时间
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

  //视频seek
  playerSeekTo = (second, action = "pause") => {
    const player = this.state.player;
    if (!player || !player.video) return;
    const duration = player.video.duration;
    player[action]();
    //不能超过视频总时长
    const time = second > duration ? duration : second;
    player.seek(time);
  };

  //切换视频
  handleVideoSwitch = (fileType, isFileName, videoUrl) => {
    const videoType = videoService.createVideoType(fileType, isFileName);
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

  //处理scrollIndex的高频率更新
  handleScrollIndexFrame = (index) => {
    if (this.state.scrollIndex === index) return;
    this.setState({ scrollIndex: index });
  };

  //更新当前时间 如果和当前保存的当前时间相等 则不更新
  handleCurrentTime = (currentTime) => {
    if (this.state.currentTime === currentTime) return;
    this.setState({ currentTime }, () => {
      //更新ScrollIndex （高頻率
      //对于空数组，findIndex是不会执行的 沒找到则返回-1
      const index = this.state.subArray.findIndex(
        (sub) => sub.start <= currentTime && sub.end > currentTime
      );
      if (index === -1) return;
      this.handleScrollIndexFrame(index);
    });
  };

  //更新播放器暂停状态
  handlePlayerPaused = (playerPaused) => {
    const player = this.state.player;
    if (player && player.video) {
      playerPaused = player.video.paused;
    }
    this.setState({ playerPaused });
  };

  //在视频开始播放进行时
  handleVideoPlaying = () => {};

  //底部waveLine左键单击时 url为空时 不会执行
  handleWaveClick = (time, event) => {
    //暂停视频 然后跳转到对应time
    this.playerSeekTo(time);
  };

  //底部waveLine右键单击时 url为空时 不会执行
  handleWaveContextmenu = (time, event) => {
    //播放视频 然后跳转到对应time
    this.playerSeekTo(time, "play");
  };

  //当timeLine的字幕块移动时
  handleSubBlockMove = (originSub, translateSecond) => {
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

  //字幕块移动的错误提示id
  toastId_subBlockMoveError = null;
  //当字幕块移动有警告时
  handleSubBlockMoveError = () => {
    if (!notifier.isActive(this.toastId_subBlockMoveError)) {
      this.toastId_subBlockMoveError = notifier.notify(
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>无效的位置，松开鼠标以修复</div>
        </div>,
        "bottom_left",
        "warning",
        {
          hideProgressBar: true,
          autoClose: 1000,
          canClose: true,
        },
        "flip"
      );
    }
  };

  //字幕块resize 改变字幕长度时
  handleSubBlockResize = (originSub, translateSecond, type) => {
    //这里是浅拷贝 数组内元素的引用并没有变化
    const subArray = [...this.state.subArray];
    const index = subArray.indexOf(originSub);
    const sub = subArray[index];
    //这里的拷贝是因为 如startTime可能为只读属性
    const tempSub = { ...sub };
    let start = null;
    let end = 0;
    if (type === "start") {
      start = Number(Number(sub.start + translateSecond).toFixed(3));
      //非法值 则不更新subArray
      if (start === null || start < 0) return;
      tempSub.startTime = subService.toTime(start);
    } else {
      end = Number(Number(sub.end + translateSecond).toFixed(3));
      //非法值 则不更新subArray
      if (end <= 0 || end <= sub.start) return;
      tempSub.endTime = subService.toTime(end);
    }
    subArray[index] = subService.mapSubToFullModel(tempSub);
    this.updateSubArray(subArray, true);
  };

  //字幕块点击事件
  handleSubBlockClick = (sub) => {
    const subArray = [...this.state.subArray];
    const scrollIndex = subArray.indexOf(sub);
    this.setState({ scrollIndex });
  };

  //当duration调整时
  handleDurationChange = (duration) => {
    this.setState({ duration });
  };

  //翻译全部字幕 使用时 调下面那个去抖版本
  handleAllSubTranslate = async (fromKey, toKey) => {
    //从存储中拿到字幕数组
    const subArray = await subService.getSubArray();
    //从存储中拿到字幕文本数组
    const subTextArr = subService.createSubTextArr(subArray);
    const translateText = translater.createTranslateTextFromStringArr(
      subTextArr
    );
    //提示
    notifier.notify(
      "翻译请求正准备发送，由于代理服务器位于美国，可能比较慢，请耐心等待...(翻译功能内置间隔为 2秒，超时为1分钟",
      "top_center"
    );
    //翻译内容为空或者出错时 返回空字符串
    let resultTextArr = [];
    try {
      resultTextArr = await translater.translateByLangKey(
        fromKey,
        toKey,
        translateText
      );
    } catch (error) {
      console.log(error);
      //提示
      notifier.notify(`翻译失败,${error.message}`, "top_center", "warning");
      return;
    }
    console.log("得到的翻译文本数组：", resultTextArr);
    //翻译出错 或结果为空时
    if (!resultTextArr || resultTextArr === []) {
      return notifier.notify("翻译结果为空", "top_center", "warning");
    }

    //翻译成功 翻译结果的数组长度，与原字幕数组长度不一致时，结束
    if (resultTextArr !== [] && resultTextArr.length !== subArray.length) {
      return notifier.notify(
        "未应用翻译结果，翻译前请不要在字幕里出现换行，也可能是原文本无需翻译",
        "top_center",
        "warning"
      );
    }

    //得到翻译后的字幕数组 使用map，然后对每个字幕对象拷贝 这样来实现深拷贝
    const translatedSubArray = subArray.map((sub, index) => ({
      ...sub,
      content: resultTextArr[index],
    }));
    //备份存储 翻译前的原数组
    this.storageSubs(subArray, true);
    //更新为 翻译后的数组 并存储
    this.updateSubArray(translatedSubArray, true);
    //提示
    notifier.notify("翻译完成", "top_center");
  };

  //翻译全部字幕 Debounce版
  handleAllSubTranslateDebounce = _.debounce(this.handleAllSubTranslate, 2000, {
    leading: true,
    trailing: false,
  });

  //从存储中读取备份的字幕数组 并更新 但不存储
  handleSubArrayBackupReset = async () => {
    const backupSubArray = await subService.getSubArray(true);
    if (backupSubArray.length === 0) {
      //提示
      notifier.notify("无备份", "top_center");
      return;
    }
    this.updateSubArray(backupSubArray, false);
    //提示
    notifier.notify(
      "已回退到备份的版本，如果想将它保存为正式版本，请进行一次提交或删除。如果不想使用此版本，刷新浏览器即可。",
      "top_center"
    );
  };

  //工具栏 videoControl
  handleVideoControlActions = (step) => {
    const player = this.state.player;
    if (!player || !player.video) return;
    if (step && typeof step === "number") {
      const currentTime = this.state.currentTime;
      const time = Math.round((currentTime + step) * 10) / 10;
      this.playerSeekTo(time);
    } else {
      if (!player.video.duration) return;
      const { paused } = player.video;
      paused ? player.play() : player.pause();
    }
  };

  //创建当前的编辑器状态对象副本
  createEditorState = () => {
    const { subArray, currentTime } = this.state;
    const arr = [...subArray].map((sub) => ({
      ...sub,
      startTime: sub.startTime,
      endTime: sub.endTime,
      length: sub.length,
    }));
    return new EditorState(arr, currentTime);
  };

  //状态回滚 true向上回滚 false向下回滚
  editorStateRollBack = (bool = true) => {
    const { pop, unPop } = editorStateService;
    let state;
    try {
      bool ? (state = pop()) : (state = unPop());
    } catch (e) {
      console.error(e);
    }
    if (typeof state === "undefined") return;
    //标识此次更新不需要记录
    this.WillMemorize = false;
    //开始回滚
    this.updateSubArray(state.subArray, true);
    this.playerSeekTo(state.currentTime);
    //回滚完成 重置标识
    this.WillMemorize = true;
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
      duration,
      playerPaused,
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
      // onEdit: this.handleSubEdit,
      onClick: this.handleSubClick,
      onCommit: this.handleSubCommit,
      // onCancel: this.handleSubCancel,
      onInsert: this.handleSubInsert,
      onSwitch: this.handleVideoSwitch,
      initPlayer: this.handlePlayerInit,
      onVideoCanPlay: this.handleVideoCanPlay,
      updateCurrentTime: this.handleCurrentTime,
      onVideoPlayerPausedSwitch: this.handlePlayerPaused,
      onVideoPlaying: this.handleVideoPlaying,
      onWaveClick: this.handleWaveClick,
      onWaveContextmenu: this.handleWaveContextmenu,
      onSubBlockMove: this.handleSubBlockMove,
      onSubBlockMoveError: this.handleSubBlockMoveError,
      onSubBlockResize: this.handleSubBlockResize,
      onSubBlockClick: this.handleSubBlockClick,
      onDurationChange: this.handleDurationChange,
      onAllSubTranslate: this.handleAllSubTranslateDebounce,
      onSubArrayBackupReset: this.handleSubArrayBackupReset,
      onVideoControlAction: this.handleVideoControlActions,
    };

    return (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="application-name" content={`${SubEditorPackage.name}`} />
          <meta
            name="description"
            content={`${SubEditorPackage.description}`}
          />
          <meta name="author" content={`${SubEditorPackage.author.name}`} />
          <meta
            name="keywords"
            content={`${SubEditorPackage.keywords.join(",")}`}
          />
          <meta name="generator" content="vscode" />
          <meta name="theme-color" content="#66cccc" />
          <meta name="google" content="notranslate" />
          <meta httpEquiv="x-ua-compatible" content="IE=edge" />
          <meta name="render" content="webkit" />
          <title>{config.subeditor_title}</title>
          <link rel="icon" href={subeditorIco} />
        </Helmet>
        <GlobalStyle />
        <Header {...funcProps} />
        <Main id="mainContainer">
          <Left>
            <VideoPlayer
              {...funcProps}
              picUrl={picUrl}
              videoUrl={videoUrl}
              subUrl={subUrl}
              player={player}
            />
            <Tools
              duration={duration}
              videoUrl={videoUrl}
              subUrl={subUrl}
              playerPaused={playerPaused}
              {...funcProps}
            />
          </Left>
          <Right>
            <SubTable
              {...funcProps}
              container={container}
              subArray={subArray}
              scrollIndex={scrollIndex}
            />
          </Right>
        </Main>
        {/* <Timeline {...funcProps}/> */}
        <WaveLine
          {...funcProps}
          currentTime={currentTime}
          videoUrl={videoUrl}
          subArray={subArray}
          duration={duration}
        />
      </React.Fragment>
    );
  }
}

export default SubEditor;
