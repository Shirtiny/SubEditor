import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import config from "../config/config.json";

const NotSupportMobileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  .messageBox {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(${require("../resources/image/subEditor.png")});
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;

    .message {
      color: #fff;
      position: relative;
      top: -15%;
      white-space: pre-wrap;
    }
  }
`;

const NotSupportMobile = () => {
  return (
    <NotSupportMobileWrapper>
      <Helmet>
        <title>{config.subeditor_title}</title>
      </Helmet>

      <div className="messageBox">
        <div className="message">
          {"Sorry,\n暂不支持移动设备，请使用PC端浏览器"}
        </div>
      </div>
    </NotSupportMobileWrapper>
  );
};

export default NotSupportMobile;
