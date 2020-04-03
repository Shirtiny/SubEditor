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
    padding: 10px;
    border-bottom: 1px solid rgb(10, 10, 10);

    .dplayer_DefaultSize {
      width: 100%;
      height: 100%;
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

  render() {
    const { videoUrl } = this.props;
    return (
      <VideoWrapper>
        <div className="box">
          <DPlayer
            className={videoUrl ? "" : "dplayer_DefaultSize"}
            options={{
              video: {
                url: videoUrl,
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
          />
        </div>
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
