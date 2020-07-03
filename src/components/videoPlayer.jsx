import React, { Component } from "react";
import styled from "styled-components";
import DPlayer from "react-dplayer";
import flvjs from "flv.js";
import logger from "../utils/logger";

const VideoWrapper = styled.div`
  display: flex;
  max-height: 55vh;
  justify-content: center;
  align-items: center;
  padding: 15px;
  // border-bottom: 1px solid rgb(10, 10, 10);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);

  .dplayer {
    max-width: 50vw;
    max-height: 50vh;
  }

  .dplayer_disable {
    pointer-events: none;
  }

  .playerBorder {
    border: 4px solid #529393;
    border-radius: 0.5em;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  }

  .hiddenSubs {
    ::cue {
      opacity: 0;
    }
  }
`;

class VideoPlayer extends Component {
  //组件是否需要更新 可以使用PureComponent来代替手写shouldComponentUpdate 它会自动浅比较前后的props有没有变化 这里不需要，因为VideoPlayer的props并不需要变化
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  //设置播放器
  load = (player) => {
    const { initPlayer } = this.props;
    initPlayer(player);
  };

  error = () => {
    const $playerContainer = document.getElementById("player");
    //错误时 将播放器设为默认大小  无法点击
    $playerContainer.classList.add("dplayer_DefaultSize", "dplayer_disable");
  };

  //视频可以播放
  canPlay = () => {
    const { player, onVideoCanPlay } = this.props;
    //提示可播放 不然会有加载失败的提示残留
    player.notice("√", 1500, 0.8);
    //将subArray 交给worker生成subUrl
    onVideoCanPlay();
    const $playerContainer = document.getElementById("player");
    //可以播放时 移除 无法点击
    $playerContainer.classList.remove("dplayer_disable");
  };

  //暂停时
  pause = () => {
    console.log("播放器暂停");
    const { onVideoPlayerPausedSwitch } = this.props;
    onVideoPlayerPausedSwitch(true);
  };

  //播放时
  play = () => {
    console.log("播放器播放");
    const { onVideoPlayerPausedSwitch } = this.props;
    onVideoPlayerPausedSwitch(false);
  };

  //播放中
  playing = () => {
    const { onVideoPlaying } = this.props;
    onVideoPlaying();
  };

  //全屏时
  fullscreen = () => {
    const $playerContainer = document.getElementById("player");
    $playerContainer.classList.remove("playerBorder");
    $playerContainer.style.resize = "";
  };

  //全屏取消时
  fullscreenCancel = () => {
    const $playerContainer = document.getElementById("player");
    $playerContainer.classList.add("playerBorder");
    $playerContainer.style.resize = "both";
  };

  render() {
    const { videoUrl, picUrl, subUrl } = this.props;
    return (
      <VideoWrapper id="playerBox">
        <DPlayer
          id="player"
          className={"playerBorder dplayer_disable "}
          style={{ resize: "both" }}
          options={{
            hotkey: false,
            video: {
              url: videoUrl,
              pic: picUrl,
              customType: {
                flvCustom: function (videoElement, player) {
                  logger.clog("支持flv");
                  if (flvjs.isSupported()) {
                    const flvPlayer = flvjs.createPlayer({
                      type: "flv",
                      url: videoElement.src,
                      hasAudio: true,
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    flvPlayer.load();
                  }
                },
              },
            },
            subtitle: {
              url: subUrl,
              type: "webvtt",
              fontSize: "25px",
              bottom: "3%",
              color: "rgb(37, 211, 211)",
            },
            contextmenu: [
              {
                text: "SubEditor",
                // link: "https://github.com/DIYgod/DPlayer",
              },
              {
                text: "使内容的高度适应于宽度",
                click: (player) => {
                  const $playerContainer = document.getElementById("player");
                  $playerContainer.style.height = "";
                },
              },
              {
                text: "默认宽度和高度",
                click: (player) => {
                  const $playerContainer = document.getElementById("player");
                  $playerContainer.style.height = "";
                  $playerContainer.style.width = "90%";
                },
              },
              {
                text: "chrome字幕隐藏/显示",
                click: (player) => {
                  const video = player.video;
                  const index = video.className.indexOf("hiddenSubs");
                  if (index > 0) {
                    video.classList.remove("hiddenSubs");
                  } else {
                    video.classList.add("hiddenSubs");
                  }
                },
              },
            ],
            theme: "#ccc",
            loop: true,
          }}
          onLoad={this.load}
          onError={this.error}
          onCanplay={this.canPlay}
          onPause={this.pause}
          onPlay={this.play}
          onPlaying={this.playing}
          onFullscreen={this.fullscreen}
          onFullscreenCancel={this.fullscreenCancel}
        />
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
