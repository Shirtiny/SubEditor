import logger from "../utils/logger";
import defaultPic from "../resources/image/subEditor.png";
import defaultSub from "../resources/subtitles/welcom.vtt";
import fileService from "./fileService";

export function createVideoType(fileType, isFileName = false) {
  if (typeof fileType !== "string") return "";
  //如果是filename
  if (isFileName) {
    const fileName = fileType;
    const index = fileName.lastIndexOf(".");
    const type = fileName.substring(index + 1);
    return type === "flv" ? "flvCustom" : type;
  }
  //video/x-flv video/mp4
  const videoRegx = /^video\/(mp4|x-(flv))+$/;
  const found = fileType.match(videoRegx);
  logger.clog("匹配视频类型", found);
  const videoType =
    found && found[2] ? found[2] + "Custom" : found ? found[1] : "";
  logger.clog("匹配和拼接的结果", videoType);
  return videoType;
}

//返回默认的视频封面
export function getDefaultPicUrl() {
  return defaultPic;
}

//默认字幕的地址
export function getDefaultSubUrl() {
  return defaultSub;
}

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
export function stopFfmpegWorker() {
  worker.terminate();
  worker = new Worker("/ffmpeg-worker-mp4.js");
  //将worker初始化
  initFfmpegWorker(worker);
}

//内封字幕 使用ffmpeg的subtitle视频滤镜 fileName: name.mp4 name.vtt
export async function encodeVideoWithSub(videoUrl, videoName, subUrl, subName) {
  if (!videoUrl || !subUrl) {
    throw new Error("视频或字幕地址为空");
  }
  if (/\.flv$/.test(videoName)) {
    throw new Error("暂不支持flv格式的编码");
  }
  const videoData = await fileService.fetchFileData(videoUrl);
  const subData = await fileService.fetchFileData(subUrl);
  const ttfData = await fileService.fetchFileData("/default.ttf");
  worker.postMessage({
    type: "run",
    TOTAL_MEMORY: 1024 * 1024 * 1024,
    arguments: [
      "-hide_banner",
      "-y",
      "-i",
      videoName,
      "-vf",
      `subtitles=${subName}`,
      `output-${videoName}`,
    ],
    MEMFS: [
      { name: videoName, data: videoData },
      { name: subName, data: subData },
      { name: "default.ttf", data: ttfData },
    ],
  });
}

const videoService = {
  createVideoType,
  getDefaultPicUrl,
  getDefaultSubUrl,
  encodeVideoWithSub,
  stopFfmpegWorker,
};

export default videoService;
