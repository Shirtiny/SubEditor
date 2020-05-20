import React, { PureComponent } from "react";
import styled from "styled-components";
import guideService from "../services/guideService";
import progressor from "../utils/progressor";
import notifier from "../utils/notifier";
import subService from "../services/subService";
import logger from "../utils/logger";
import SubEditorPackage from "../../package.json";

const HeaderWrap = styled.header`
  //导航栏固定50px
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: hsla(0, 0%, 100%, 0.8);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);

  .band {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 30px;
    flex-grow: 6;
  }

  .body {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;

    .buttons {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .links {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      margin-right: 40px;
      i {
        margin-right: 5px;
      }
      a {
        color: #4c7b7b;
        text-decoration: none;
        font-size: 18px;
        font-weight: 600;
        padding: 0 10px 0 10px;

        &:hover {
          color: #66cccc;
          //   text-decoration: underline;
        }
      }
    }

    .users {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      margin-right: 20px;
      .avatar {
        border-radius: 50%;
        height: 40px;
        border: 1px solid #ddd;
        padding: 4px;
        display: block;
      }
    }
  }
`;

const LogoYa = styled.a`
  text-decoration: none;
  font-size: 22px;
  font-style: italic;
  font-weight: 400;
  color: #66cccc;

  :hover {
    text-decoration: none;
    color: #66cccc;
  }

  .version {
    font-size: 12px;
    font-weight: 600;
    margin-left: 20px;
    opacity: 0.4;
    font-style: italic;
    color: #262a3e;
  }
`;

class Header extends PureComponent {
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
    return (
      <HeaderWrap>
        <div className="band">
          <LogoYa href={guideService.subEditorPath} title="Copyright © 2020 SH">
            SubEditor
            <span className="version">version {SubEditorPackage.version}</span>
          </LogoYa>
        </div>

        <div className="body">
          <div className="links">
            <a href="https://github.com/Shirtiny/SubEditor" title="前往Github">
              <i className="fa fa-github" aria-hidden="true"></i>Github
            </a>
          </div>
          <div className="users">
            <a href="http://bbs.vcb-s.com/" title="用户">
              <img
                className="avatar"
                alt="avatar"
                src="http://bbs.vcb-s.com/data/attachment/common/d6/common_39_icon.png"
              />
            </a>
          </div>
        </div>
      </HeaderWrap>
    );
  }
}

export default Header;
