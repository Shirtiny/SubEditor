import React, { PureComponent } from "react";
import styled from "styled-components";
import guideService from "../services/guideService";
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
      padding-right: 20px;
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
      span {
        color: #4c7b7b;
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }
      span:hover {
        color: #66cccc;
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
  state = {
    user: {},
  };

  async componentDidMount() {}

  handleLogout = async () => {
    //刷新页面
    document.location.reload();
  };

  render() {
    return (
      <HeaderWrap>
        <div className="band">
          <LogoYa href={guideService.subEditorPath} title="Copyright © 2020 SH">
            sub-editor
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
            <a
              href="/"
              title={this.state.user.userName || "未登录"}
              style={{ marginRight: "10px" }}
            >
              <img
                className="avatar"
                alt="avatar"
                src={
                  this.state.user.avatarImage ||
                  `${guideService.home}subEditorLogo.png`
                }
              />
            </a>
            {this.state.user.userName && (
              <span onClick={this.handleLogout} title="退出登录">
                注销
              </span>
            )}
          </div>
        </div>
      </HeaderWrap>
    );
  }
}

export default Header;
