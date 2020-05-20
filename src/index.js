import React from "react";
import ReactDOM from "react-dom";
// import { BrowserRouter } from "react-router-dom";
// 为了使用github的pages服务 改用HashRouter
import { HashRouter } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import "./index.css";
import "normalize.css";
import "font-awesome/css/font-awesome.css";
import "nprogress/nprogress.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-virtualized/styles.css";
import translater from "./utils/translater";

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);

translater.baiduTranslate("en","百度翻译 我是你爸爸")

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
