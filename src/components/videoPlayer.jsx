import React, { PureComponent } from "react";
import styled from "styled-components";
import DPlayer from "react-dplayer";
import flvjs from "flv.js";
import logger from "../utils/logger";

const VideoWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  max-height: 55vh;
  justify-content: center;
  align-items: center;
  padding: 15px;
  // border-bottom: 1px solid rgb(10, 10, 10);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);

  .play-icon-container {
    cursor: pointer;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -75px 0 0 -66px;
    height: 150px;
    width: 150px;
    padding: 12px;
    box-sizing: border-box;
    /* background: rgba(0, 0, 0, 0.5); */
    border-radius: 50%;
    opacity: 0.8;

    > svg {
      fill: rgba(0, 0, 0, 0.3);
      width: 100%;
      height: 100%;
    }
  }

  .dplayer {
    // max-width: 50vw;
    // max-height: 50vh;
  }

  .defaultSize {
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

class VideoPlayer extends PureComponent {
  state = {
    showPlayIcon: false,
  };

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
    player.notice("√ ready", 1500, 0.8);
    this.setState({ showPlayIcon: true });
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
    this.setState({ showPlayIcon: false });
    onVideoPlayerPausedSwitch(true);
  };

  //播放时
  play = () => {
    console.log("播放器播放");
    const { onVideoPlayerPausedSwitch } = this.props;
    this.setState({ showPlayIcon: false });
    onVideoPlayerPausedSwitch(false);
  };

  //播放中
  playing = () => {
    const { onVideoPlaying } = this.props;
    this.setState({ showPlayIcon: false });
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
    const { showPlayIcon } = this.state;
    return (
      <VideoWrapper id="playerBox">
        <DPlayer
          id="player"
          className={`playerBorder dplayer_disable ${
            videoUrl ? "" : "defaultSize"
          }`}
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
        {Boolean(showPlayIcon) && (
          <span
            onClick={() => this.props.onVideoControlAction()}
            class="play-icon-container"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 16 32"
            >
              <path d="M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z"></path>
            </svg>
          </span>
        )}
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
