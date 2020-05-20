import React, { Component } from "react";
import styled from "styled-components";
import progressor from "../utils/progressor";
import notifier from "../utils/notifier";
import subService from "../services/subService";
import logger from "../utils/logger";
import RippleButton from "./common/rippleButton";

const ToolsWrapper = styled.div`
  flex: 1;
  display: flex;
  padding: 15px;

  .toolsContainerBox {
    display: flex;
    flex: 1;
  }

  .clearBox {
    flex: 1;
    display: flex;
    flex-direction: column-reverse;
  }
  .toolsBox {
    flex: 1;
    border: 1px dashed #529393;
    display: flex;
    flex-direction: column;

    .shRow {
      display: flex;
    }

    .shRowHeader {
      width: 100px;
      display: flex;
      padding: 5px;
      justify-content: center;
      align-items: center;
    }

    .shRowBody {
      flex: 1;
      display: flex;
      padding: 5px;
      justify-content: center;
      align-items: center;
      flex-direction: row;

      .toolsBtn {
        margin-right: 15px;
        z-index: 1;
        // pointer-events: none;
      }
    }
  }

  //滑块样式
  input[type="range"] {
    appearance: none;
    height: 3px;
    width: 200px;
    outline: none;
    background-color: #529393;
    border-radius: 10px;
  }
  //firefox去input range 的outline
  input[type="range"]::-moz-focus-outer {
    border: 0;
  }

  //chorme
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    outline: none;
    height: 15px;
    width: 15px;
    background: #ffffff;
    border-radius: 50%;
  }
`;

//利用了绝对定位 绝对定位可以让元素脱离正常的文档流，实现更灵活的布局方式
const FileYinput = styled.input`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: auto;
  cursor: pointer;
`;

class Tools extends Component {
  handleSubFile = async (e) => {
    progressor.start();
    const file = e.currentTarget.files[0];
    const { updateSubArray, updateSubUrl } = this.props;
    try {
      const vttStr = await subService.readSubFileAsText(file);
      //开一个预览字幕的提示
      notifier.notify(<p>{vttStr}</p>, "top_center", "default", {
        autoClose: false,
        className: "textReader",
      });
      const subUrl = subService.createVttSubBlobUrl(vttStr);
      updateSubUrl(subUrl, true);
      //从url中读取字幕数组
      const subArray = await subService.createSubArray(subUrl);
      updateSubArray(subArray, true);
      //释放url资源
      // URL.revokeObjectURL(subUrl);
      // logger.clog("读入完成，释放url资源：", subUrl);
    } catch (e) {
      notifier.notify(`<Header>${e.message}`, "top_center", "warning");
    }
    progressor.done();
  };

  //拿到上传的视频
  handleVideoFile = (e) => {
    progressor.start();
    const file = e.currentTarget.files[0];
    const $video = document.createElement("video");
    logger.clog("创建元素：", $video, $video.canPlayType(file.type));
    const videoUrl = URL.createObjectURL(file);
    logger.clog("视频url", videoUrl);
    const { onSwitch } = this.props;
    onSwitch(file.type, videoUrl);
    progressor.done();
  };

  //下载字幕
  handleSubFileDownload = () => {
    const { onDownload } = this.props;
    onDownload();
  };

  //清空字幕
  handleSubClean = () => {
    const { onClean } = this.props;
    onClean();
  };

  render() {
    const { duration, onDurationChange } = this.props;
    return (
      <ToolsWrapper>
        <div className="toolsContainerBox">
          <div className="clearBox">
            <input
              type="range"
              title={duration}
              value={duration}
              min="10"
              max="20"
              step="1"
              onChange={(e) => {
                onDurationChange(Number(e.currentTarget.value));
              }}
            />
          </div>
          <div className="toolsBox">
            <div className="shRow">
              <div className="shRowHeader">
                <RippleButton
                  disabled={true}
                  label="常规"
                  width="50px"
                  height="40px"
                  color="gray"
                  bgColor="white"
                />
              </div>
              <div className="shRowBody">
                <RippleButton
                  className="toolsBtn"
                  width="45px"
                  height="35px"
                  label={
                    <i className="fa fa-folder-open" aria-hidden="true"></i>
                  }
                  element={
                    <FileYinput
                      type="file"
                      name="file"
                      onChange={this.handleSubFile}
                      title="打开字幕"
                    />
                  }
                  color="white"
                  bgColor="#529393"
                />
                <RippleButton
                  className="toolsBtn"
                  width="45px"
                  height="35px"
                  label={
                    <i className="fa fa-play-circle" aria-hidden="true"></i>
                  }
                  element={
                    <FileYinput
                      className="uploadVideo"
                      type="file"
                      name="file"
                      onChange={this.handleVideoFile}
                      title="打开视频"
                    />
                  }
                  color="white"
                  bgColor="#529393"
                  title="dd"
                  onClick={() => console.log("click")}
                />
                <RippleButton
                  className="toolsBtn"
                  width="45px"
                  height="35px"
                  label={
                    <i className="fa fa-cloud-download" aria-hidden="true"></i>
                  }
                  color="white"
                  bgColor="#529393"
                  title="下载字幕"
                  onClick={this.handleSubFileDownload}
                />
                <RippleButton
                  className="toolsBtn"
                  width="45px"
                  height="35px"
                  label={<i className="fa fa-trash" aria-hidden="true"></i>}
                  color="white"
                  bgColor="#ec6464"
                  title="清空字幕"
                  onClick={this.handleSubClean}
                />
              </div>
            </div>
          </div>
        </div>
      </ToolsWrapper>
    );
  }
}

export default React.memo(Tools);
