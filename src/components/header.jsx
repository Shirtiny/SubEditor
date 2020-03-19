import React, { Component } from "react";
import styled from "styled-components";
import guider from "../services/guideService";

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
  }

  .body {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .links {
      margin-right: 20px;
      i {
        margin-right: 5px;
      }
      a {
        color: #4c7b7b;
        text-decoration: none;
        font-size: 18px;
        font-weight: 600;

        &:hover {
          color: #66cccc;
          //   text-decoration: underline;
        }
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
  //   height: 40px;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
  color: #ccc;
  background: rgb(102, 93, 195);
  border-style: none;
  //   border-radius: 20px;
  border-left: 1px solid rgb(10, 10, 10);
  padding: 9px 16px;
  outline: none;
  transition: all 100ms ease-in-out 0s;

  &:hover {
    color: #fff;
    background-color: rgb(66, 82, 95);
  }

  i {
    margin-right: 5px;
  }
`;

class Header extends Component {
  state = {};

  render() {
    return (
      <HeaderWrap>
        <div className="band">
          <LogoYa href={guider.subEditorPath}>
            SubEditor
            <span className="version">version 1.0.1</span>
          </LogoYa>
        </div>
        <div className="body">
          <div className="links">
            <a href="https://github.com/zhw2590582/SubPlayer">
              <i class="fa fa-github" aria-hidden="true"></i>Github
            </a>
          </div>
          <BtnYbutton>上传字幕</BtnYbutton>
          <BtnYbutton>上传视频</BtnYbutton>
          <BtnYbutton>下载字幕</BtnYbutton>
        </div>
      </HeaderWrap>
    );
  }
}

export default Header;
