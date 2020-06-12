import React, { PureComponent } from "react";
import styled from "styled-components";
import progressor from "../utils/progressor";
import notifier from "../utils/notifier";
import subService from "../services/subService";
import translater from "../utils/translater";
import logger from "../utils/logger";
import RippleButton from "./common/rippleButton";

const ToolsWrapper = styled.div`
  flex: 1;
  display: flex;
  padding: 15px 0 15px 0;
  // backgroud-color: #c0d9d9;

  .toolsContainerBox {
    display: flex;
    flex: 1;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    background-color: #e3eeeef2;
    padding: 15px;
    max-width: 950px;
    max-height: 250px;
  }

  .leftBox {
    flex: 1;
    display: flex;
    background: url(${require("../imgs/blackboard.png")}) no-repeat;
    background-size: 47%;
    background-position: 85% center;

    .controlBox {
      width: 200px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .videoControlBox {
        display: flex;
        margin-bottom: 15px;
        justify-content: space-around;

        .controlIcon {
          color: #529393;
        }
      }
    }
  }

  .toolsBox {
    flex: 1;
    border: 1px dashed #529393;
    border-radius: 6px 6px;
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
      padding: 0 30px 0 30px;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;

      .toolsBtn {
        // margin-right: 15px;
        z-index: 1;
        // pointer-events: none;
      }
    }

    //select样式
    .toolsSelect {
      user-select: none;
      border: none;
      background: none;
      appearance: none;
      -webkit-appearance: none;
      -ms-appearance: none;
      -moz-appearance: none;
      -o-appearance: none;
      outline: none;
      text-align: center; //文字对齐方式
      text-align-last: center;
      height: 35px;
      width: 90px;
      border-radius: 5px;
      background: linear-gradient(150deg, #00dfea, #66cccc);
      color: white;
      cursor: pointer;
      box-shadow: 2px 1px 3px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      // margin-right: 10px;
      option {
        color: black;
        background: #ffffff;
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

class Tools extends PureComponent {
  //语言列表
  languages = translater.getBaiduTranslateLanguages();
  languagesKeys = Object.keys(this.languages);

  state = {
    currentLanguageKeyFrom: "auto",
    // 不能为auto
    currentLanguageKeyTo: "zh",
  };

  handleLanguageChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleTranslate = () => {
    const { onAllSubTranslate } = this.props;
    const { currentLanguageKeyFrom, currentLanguageKeyTo } = this.state;
    onAllSubTranslate(currentLanguageKeyFrom, currentLanguageKeyTo);
  };

  handleTranslateBackupReset = () => {
    const { onSubArrayBackupReset } = this.props;
    onSubArrayBackupReset();
  };

  handleSubFile = async (e) => {
    progressor.start();
    const file = e.currentTarget.files[0];
    if (file.type !== "text/vtt") {
      progressor.done();
      notifier.notify(
        `暂只支持vtt格式的字幕文件，其他格式将在后续更新中加入`,
        "top_center",
        "warning"
      );
      return;
    }
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
    } catch (e) {
      notifier.notify(`<Header>${e.message}`, "top_center", "warning");
    }
    progressor.done();
  };

  //拿到上传的视频
  handleVideoFile = (e) => {
    progressor.start();
    const file = e.currentTarget.files[0];
    // maybe video/mp4 video/x-flv
    const $video = document.createElement("video");
    //如果文件不能被web播放器播放，并且不是flv格式
    if (
      $video.canPlayType(file.type) !== "maybe" &&
      file.type !== "video/x-flv"
    ) {
      progressor.done();
      notifier.notify(
        `无法播放该文件，播放器明确支持mp4、flv格式的视频`,
        "top_center",
        "warning"
      );
      return;
    }
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
    const { currentLanguageKeyFrom, currentLanguageKeyTo } = this.state;
    return (
      <ToolsWrapper>
        <div className="toolsContainerBox">
          <div className="leftBox">
            <div className="controlBox">
              <div className="videoControlBox">
                {/* 记得设置快捷键 */}
                <i className="fa fa-backward controlIcon"></i>
                <i className="fa fa-step-backward controlIcon"></i>
                <i className="fa fa-step-forward controlIcon"></i>
                <i className="fa fa-forward controlIcon"></i>
              </div>
              <input
                type="range"
                title={`时间轴：`}
                value={duration}
                min="10"
                max="20"
                step="1"
                onChange={(e) => {
                  onDurationChange(Number(e.currentTarget.value));
                }}
              />
            </div>
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
            <div className="shRow">
              <div className="shRowHeader">
                <RippleButton
                  disabled={true}
                  label="翻译"
                  width="50px"
                  height="40px"
                  color="gray"
                  bgColor="white"
                />
              </div>
              <div className="shRowBody">
                <select
                  className="toolsSelect"
                  name="currentLanguageKeyFrom"
                  value={currentLanguageKeyFrom}
                  title="当前语言"
                  onChange={(e) =>
                    this.handleLanguageChange(
                      e.currentTarget.name,
                      e.currentTarget.value
                    )
                  }
                >
                  {this.languagesKeys.map((k) => (
                    <option key={k} value={k}>
                      {this.languages[k]}
                    </option>
                  ))}
                </select>

                <select
                  className="toolsSelect"
                  name="currentLanguageKeyTo"
                  value={currentLanguageKeyTo}
                  title="翻译至"
                  onChange={(e) =>
                    this.handleLanguageChange(
                      e.currentTarget.name,
                      e.currentTarget.value
                    )
                  }
                >
                  {this.languagesKeys
                    //to Key 的值 不能让用户选为auto
                    .filter((v) => v !== "auto")
                    .map((k) => (
                      <option key={k} value={k}>
                        {this.languages[k]}
                      </option>
                    ))}
                </select>

                <RippleButton
                  className="toolsBtn"
                  width="35px"
                  height="35px"
                  label={
                    <i
                      style={{ fontSize: "16px" }}
                      className="fa fa-globe"
                      aria-hidden="true"
                    ></i>
                  }
                  color="white"
                  bgColor="#66cccc"
                  title="点击翻译 (请给它些休息时间)"
                  onClick={this.handleTranslate}
                />

                <RippleButton
                  className="toolsBtn"
                  width="35px"
                  height="35px"
                  label={
                    <i
                      style={{ fontSize: "16px" }}
                      className="fa fa-undo"
                      aria-hidden="true"
                    ></i>
                  }
                  color="white"
                  bgColor="#00dfea"
                  title="回退至上次翻译前的版本"
                  onClick={this.handleTranslateBackupReset}
                />
              </div>
            </div>
          </div>
        </div>
      </ToolsWrapper>
    );
  }
}

export default Tools;
