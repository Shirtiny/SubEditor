import React from "react";
import ReactDOM from "react-dom";
// import { BrowserRouter } from "react-router-dom";
// 为了使用github的pages服务 改用HashRouter
import { HashRouter } from "react-router-dom";
import App from "./App";
import NotSupportMobile from "./components/notSupportMobile";
import * as serviceWorker from "./serviceWorker";
import guideService from "./services/guideService";
import "./index.css";
import "normalize.css";
import "font-awesome/css/font-awesome.css";
import "nprogress/nprogress.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-virtualized/styles.css";
import fileService from "./services/fileService";
import subService from "./services/subService";

const isMobile = guideService.isMobile();

ReactDOM.render(
  isMobile ? (
    <NotSupportMobile />
  ) : (
    <HashRouter>
      <App />
    </HashRouter>
  ),
  document.getElementById("root")
);

const worker = new Worker("/ffmpeg-worker-mp4.js");

worker.onmessage = function (e) {
  const msg = e.data;
  switch (msg.type) {
    case "ready":
      console.log("shFFmpegWorker ready");
      break;
    case "stdout":
      console.log(msg.data);
      break;
    case "stderr":
      console.log(msg.data);
      break;
    case "done":
      console.log("shFFmpegWorker works done", msg.data);
      const res = msg.data.MEMFS[0];
      const { name, data } = res;
      const url = URL.createObjectURL(
        new File([data.buffer], name, { type: "video/mp4" })
      );
      subService.downloadFromUrl(url, name);
      break;
    default:
      return;
  }
};
const testFfmpeg = async () => {
  const testData = await fileService.fetchFileData("/friday.mp4");
  const vttData = await fileService.fetchFileData("/friday.vtt");
  const ttfData = await fileService.fetchFileData("/default.ttf");
  console.log(testData, vttData);
  worker.postMessage({
    type: "run",
    TOTAL_MEMORY: 256 * 1024 * 1024,
    arguments: ["-y","-i","test.vtt","output.ass"],
    // arguments: [
    //   "-y",
    //   "-i",
    //   "test.mp4",
    //   "-vf",
    //   "subtitles=test.vtt",
    //   "output.mp4",
    // ],
    MEMFS: [
      { name: "test.mp4", data: testData },
      { name: "test.vtt", data: vttData },
      { name: "default.ttf", data: ttfData },
    ],
  });
};

// testFfmpeg();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
