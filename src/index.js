import React from "react";
import ReactDOM from "react-dom";
// import { BrowserRouter } from "react-router-dom";
// 为了使用github的pages服务 改用HashRouter
import { HashRouter } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import guideService from "./services/guideService";
import "./index.css";
import "normalize.css";
import "font-awesome/css/font-awesome.css";
import "nprogress/nprogress.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-virtualized/styles.css";

const isMobile = guideService.isMobile();

ReactDOM.render(
  isMobile ? (
    "暂不支持移动设备"
  ) : (
    <HashRouter>
      <App />
    </HashRouter>
  ),
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
