import logger from "../utils/logger";
// import ffmpegWorker from "../utils/ffmpegWorker"
import defaultPic from "../resources/image/subEditor.png";
import defaultSub from "../resources/subtitles/eva.vtt";
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
  // ffmpegWorker.postMessage({
  //   type: "run",
  //   TOTAL_MEMORY: 1024 * 1024 * 1024,
  //   arguments: [
  //     "-hide_banner",
  //     "-y",
  //     "-i",
  //     videoName,
  //     "-vf",
  //     `subtitles=${subName}`,
  //     `output-${videoName}`,
  //   ],
  //   MEMFS: [
  //     { name: videoName, data: videoData },
  //     { name: subName, data: subData },
  //     { name: "default.ttf", data: ttfData },
  //   ],
  // });
}

const videoService = {
  createVideoType,
  getDefaultPicUrl,
  getDefaultSubUrl,
  encodeVideoWithSub,
};

export default videoService;
