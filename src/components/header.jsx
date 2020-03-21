import React, { Component } from "react";
import styled from "styled-components";
import guider from "../services/guiderService";
import progressor from "../services/progressorService";
import notifier from "../services/notifierService";
import subService from "../services/subService";

const HeaderWrap = styled.header`
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid;
  background-color: hsla(0, 0%, 100%, 0.8);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);

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

  : hover {
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

const BtnYbutton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  // height: 100%;
  cursor: pointer;
  overflow: hidden;
  color: #ccc;
  background: #529393;
  border-style: none;
  border-radius: 20px;
  // border-left: 1px solid rgb(10, 10, 10);
  padding: 9px 16px;
  margin-right: 10px;
  // outline: none;
  transition: all 300ms linear 0s;

  span {
    display: none;
  }

  &:hover {
    color: #fff;
    background-color: #43d7d7;
    height: 40px;
    span {
      display: block;
    }
  }

  i {
    margin-right: 0px;
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
  cursor: pointer;
`;

class Header extends Component {
  state = {};

  handleSubFile = async e => {
    progressor.start();
    const file = e.currentTarget.files[0];

    try {
      const vttStr = await subService.readSubFileAsText(file);
      notifier.notify(<p>{vttStr}</p>, "top_left", "default", {
        autoClose: false,
        className: "textReader"
      });
      const subUrl = subService.createVttSubBlobUrl(vttStr);
      console.log("url", subUrl);
      //从url中读取字幕数组
      const subArray = await subService.createSubArray(subUrl);
      console.log("更新subArray", subArray);
      //释放url资源
      URL.revokeObjectURL(subUrl);
      console.log("释放资源：", subUrl);
    } catch (e) {
      notifier.notify(`<Header>读取字幕文件失败`, "top_center", "warning");
    }
    progressor.done();
  };

  handleVideoFile = e => {
    const file = e.currentTarget.files[0];
    const $video = document.createElement("video");
    console.log("创建元素：", $video, $video.canPlayType(file.type));
    const videoUrl = URL.createObjectURL(file);
    console.log("视频url", videoUrl);
    const { updateOneState } = this.props;
    updateOneState({ videoUrl });
    //释放资源
    // URL.revokeObjectURL(videoUrl);
  };

  render() {
    return (
      <HeaderWrap>
        <div className="band">
          <LogoYa href={guider.subEditorPath} title="Copyright © 2020 SH">
            SubEditor
            <span className="version">version 1.0.1</span>
          </LogoYa>
        </div>

        <div className="body">
          <div className="buttons">
            <BtnYbutton>
              <i className="fa fa-folder-open" aria-hidden="true"></i>
              <FileYinput
                className="uploadSubtitle"
                type="file"
                name="file"
                onChange={this.handleSubFile}
              />
              <span>添加字幕</span>
            </BtnYbutton>
            <BtnYbutton>
              <i className="fa fa-play-circle" aria-hidden="true"></i>
              <FileYinput
                className="uploadVideo"
                type="file"
                name="file"
                onChange={this.handleVideoFile}
              />
              <span>打开视频</span>
            </BtnYbutton>
            <BtnYbutton>
              <i className="fa fa-cloud-download" aria-hidden="true"></i>
              <span>下载字幕</span>
            </BtnYbutton>
          </div>
          <div className="links">
            <a href="https://github.com/Shirtiny/SubEditor" title="前往Github">
              <i className="fa fa-github" aria-hidden="true"></i>Github
            </a>
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
