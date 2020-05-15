import logger from "../utils/logger";
import guideService from "./guideService";

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
  return `${guideService.home}/subEditor.png`;
}

const videoService = {
  createVideoType,
  getDefaultPicUrl,
};

export default videoService;
