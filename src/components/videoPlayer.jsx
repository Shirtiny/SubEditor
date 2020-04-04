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
  setArtPlayer = player => {
    const { updateOneState, videoUrl } = this.props;
    logger.clog("地址:", videoUrl);
    logger.clog("播放器", player);
    updateOneState({ player });
  };

  error = () => {
    const div = document.getElementById("dplayer");
    div.className += " dplayer_DefaultSize";
  };

  loadstart = () => {
    const { player } = this.props;
    //提示载入开始 不然会有加载失败的提示残留
    player.notice("载入...", 1500, 0.8);
  };

  render() {
    const { videoUrl, picUrl } = this.props;
    return (
      <VideoWrapper>
        <div className="box">
          <DPlayer
            id="dplayer"
            className={picUrl ? "" : "dplayer_DefaultSize"}
            style={{ resize: "both" }}
            options={{
              video: {
                url: videoUrl,
                pic: picUrl,
                customType: {
                  flvCustom: function(videoElement, player) {
                    logger.clog("支持flv");
                    if (flvjs.isSupported()) {
                      var flvPlayer = flvjs.createPlayer({
                        type: "flv",
                        url: videoElement.src
                      });
                      flvPlayer.attachMediaElement(videoElement);
                      flvPlayer.load();
                    }
                  }
                }
              },
              theme: "#ccc"
            }}
            onLoad={this.setArtPlayer}
            onError={this.error}
            onLoadstart={this.loadstart}
          />
        </div>
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
