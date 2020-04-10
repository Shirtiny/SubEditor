import React, { Component } from "react";
import styled from "styled-components";
import DPlayer from "react-dplayer";
import flvjs from "flv.js";
import logger from "../utils/logger";

const VideoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70%;
    padding: 15px;
    // border-bottom: 1px solid rgb(10, 10, 10);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);

    .dplayer_DefaultSize {
      width: 90%;
      height: 90%;
    }

    .dplayer {
      max-width: 100%;
      max-height: 100%;
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
  }
`;

class VideoPlayer extends Component {
  //设置播放器
  setPlayer = (player) => {
    const { initPlayer, videoUrl } = this.props;
    logger.clog("地址:", videoUrl);
    logger.clog("播放器", player);
    initPlayer(player);
  };

  error = () => {
    const div = document.getElementById("player");
    div.className += " dplayer_DefaultSize";
  };

  //视频可以播放
  canPlay = () => {
    const { player, onVideoCanPlay } = this.props;
    //提示可播放 不然会有加载失败的提示残留
    player.notice("√", 1500, 0.8);
    //将subArray 交给worker生成subUrl
    onVideoCanPlay();
  };

  //播放中
  playing = () => {
    const { player, updateCurrentTime } = this.props;
    //1秒60帧 根据屏幕刷新虑有所变化，time为时间戳 ，每一帧的工作内容为：
    function frameWork(time) {
      //如果视频没有暂停 下一帧继续调用frameWork
      if (!player.video.paused) {
        //更新当前时间
        updateCurrentTime(player.video.currentTime);
        window.requestAnimationFrame(frameWork);
      }
    }
    //作为启动
    window.requestAnimationFrame(frameWork);
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
      <VideoWrapper>
        <div id="playerBox" className="box">
          <DPlayer
            id="player"
            className={"playerBorder " + (picUrl ? "" : "dplayer_DefaultSize")}
            style={{ resize: "both" }}
            options={{
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
            onLoad={this.setPlayer}
            onError={this.error}
            onCanplay={this.canPlay}
            onPlaying={this.playing}
            onFullscreen={this.fullscreen}
            onFullscreenCancel={this.fullscreenCancel}
          />
        </div>
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
