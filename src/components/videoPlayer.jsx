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
      border: 4px solid #529393;
      border-radius: 0.5em;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
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

  render() {
    const { videoUrl, picUrl, subUrl } = this.props;
    return (
      <VideoWrapper>
        <div id="playerBox" className="box">
          <DPlayer
            id="player"
            className={picUrl ? "" : "dplayer_DefaultSize"}
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
                color: "rgb(37, 211, 211)"
              },
              contextmenu: [
                {
                  text: "SubEditor",
                  // link: "https://github.com/DIYgod/DPlayer",
                },
                {
                  text: "等比例适应(以宽度为参考)",
                  click: (player) => {
                    const $playerContainer = document.getElementById("player");
                    $playerContainer.style.height = "";
                  },
                },
              ],
              theme: "#ccc",
              loop: true,
            }}
            onLoad={this.setPlayer}
            onError={this.error}
            onCanplay={this.canPlay}
          />
        </div>
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
