import fileService from "../services/fileService";

//ffmpeg的worker
let worker = new Worker("/ffmpeg-worker-mp4.js");
let outputUrl = "";
initFfmpegWorker(worker);

//配置worker
function initFfmpegWorker(worker) {
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
        //释放上一个url
        URL.revokeObjectURL(outputUrl);
        outputUrl = URL.createObjectURL(new File([data.buffer], name));
        fileService.downloadFromUrl(outputUrl, name);
        break;
      default:
        return;
    }
  };
}

//终止worker
export function terminateWork() {
  worker.terminate();
  worker = new Worker("/ffmpeg-worker-mp4.js");
  //将worker初始化
  initFfmpegWorker(worker);
}

export function postMessage(message) {
  if (!worker) return;
  worker.postMessage(message);
}

const ffmpegWorker = {
  postMessage,
  terminateWork,
};

export default ffmpegWorker;
