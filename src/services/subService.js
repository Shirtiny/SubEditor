import Sub from "../model/sub";
import timeFormatter from "../utils/timeFormatter";
import logger from "../utils/logger";
import config from "../config/config.json";

//sub数组 存在localstorage的key
const subArrayKey = config.sub_storage_key || "DefaultSubs";

//PromiseExecutor 将字幕文件读取为字符串
function readAsTextPE(resolve, reject, file) {
  const reader = new FileReader();
  reader.readAsText(file);
  //出错时触发
  reader.onerror = error => {
    reject(error);
  };
  //读取完成时 成功或失败 触发
  reader.onload = () => {
    //读取失败时 result为null
    resolve(reader.result);
  };
}

//将字幕文件读取为字符串
export async function readSubFileAsText(subFile) {
  let text = "";
  try {
    text = await new Promise((resolve, reject) =>
      readAsTextPE(resolve, reject, subFile)
    );
  } catch (e) {
    logger.clog("字幕文件读取失败；", e);
    e.message = "字幕文件读取失败；";
    throw e;
  }
  return text;
}

//PromiseExecutor 使用track分析vtt字幕 返回完成后的cues对象
function analyseSubPE(resolve, reject, subUrl) {
  const $video = document.createElement("video");
  const $track = document.createElement("track");
  $video.appendChild($track);
  $track.default = true;
  $track.kind = "metadata";
  //这里需要执行很长时间
  $track.src = subUrl;
  //执行中出错
  $track.onerror = error => {
    reject(error);
  };
  //执行完成后 成功或失败
  $track.onload = () => {
    //返回cues对象
    resolve($track.track.cues);
  };
}

//将字幕的秒数 转为 时:分:秒 的时间轴格式
export function toTime(number) {
  return timeFormatter.number2Time(number);
}

//创建字幕数组 参数是一个vtt字幕文件的url
export async function createSubArray(subUrl) {
  let subCues = null;
  try {
    subCues = await new Promise((resolve, reject) =>
      analyseSubPE(resolve, reject, subUrl)
    );
  } catch (e) {
    logger.clog("字幕装载失败：", e);
    e.message = "字幕装载失败";
    throw e;
  }
  const VTTCues = Array.from(subCues || {});
  logger.clog("得到VTTCues数组：", VTTCues);
  const subArray = VTTCues.map(c => {
    return new Sub(c.startTime, c.endTime, c.text);
  });
  logger.clog("得到字幕数组：", subArray);
  return subArray;
}

//创建vtt字幕的Blob对象 方便track分析 参数为vtt格式的字符串 返回该对象的url
export function createVttSubBlobUrl(vttStr) {
  const vttBlob = new Blob([vttStr], {
    type: "text/vtt"
  });
  logger.clog("vtt字幕Blob对象", vttBlob);
  return URL.createObjectURL(vttBlob);
}

//将sub对象的秒数转为time时间轴类型分别拿出来 映射成localstorage的存储模型
export function mapSubToFullModel(sub) {
  return {
    start: timeFormatter.time2Number(sub.startTime),
    startTime: sub.startTime,
    end: timeFormatter.time2Number(sub.endTime),
    endTime: sub.endTime,
    length: timeFormatter.getTimeLength(sub.startTime,sub.endTime),
    content: sub.content
  };
}

//PromiseExecutor 将字幕数组存入localStorage
function storageSubsPE(resolve, reject, subArray) {
  try {
    const subs = subArray.map(sub => mapSubToFullModel(sub));
    const json = JSON.stringify(subs);
    localStorage.setItem(subArrayKey, json);
    resolve(json);
  } catch (e) {
    logger.clog("subs存入local时出错", e);
    reject(e);
  }
}

//把sub数组存入localstorage
export function saveSubArray(subArray) {
  //将sub对象的秒数转为time时间轴类型 并存入localStorage
  return new Promise((resolve, reject) =>
    storageSubsPE(resolve, reject, subArray)
  );
}

//PromiseExecutor 从localStorage中读取sub数组 可能会解析出错以及得到null 这里对null返回空数组
function getParseSubArrayPE(resolve, reject) {
  const subsJson = localStorage.getItem(subArrayKey);
  try {
    const subArray = JSON.parse(subsJson);
    resolve(subArray || []);
  } catch (e) {
    logger.clog("读取local后，Json解析出错", e);
    reject(e);
  }
}

//从localStorage中读取sub数组
export function getSubArray() {
  return new Promise((resolve, reject) => getParseSubArrayPE(resolve, reject));
}

const subService = {
  readSubFileAsText,
  createSubArray,
  createVttSubBlobUrl,
  mapSubToFullModel,
  saveSubArray,
  getSubArray
};

export default subService;