import logger from "../utils/logger";
import defaultPic from "../resources/image/subEditor.png"
import defaultSub from "../resources/subtitles/welcom.vtt"

export function createVideoType(fileType) {
  if (typeof fileType !== "string") return "";
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

const videoService = {
  createVideoType,
  getDefaultPicUrl,
  getDefaultSubUrl,
};

export default videoService;
