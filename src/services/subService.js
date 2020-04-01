import Sub from "../model/sub";
import timeFormatter from "../utils/timeFormatter";
import logger from "../utils/logger";
import config from "../config/config.json";
import validateService from "./validateService";

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

//将时:分:秒 的时间轴格式 转为秒数
export function toNumber(time) {
  return Number(timeFormatter.time2Number(time));
}

//计算两个time的时长
export function getTimeLength(startTime, endTime) {
  return Number(timeFormatter.getTimeLength(startTime, endTime));
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
export function createVttSubBlobUrl(vttText) {
  const vttBlob = new Blob([vttText], {
    type: "text/vtt"
  });
  logger.clog("vtt字幕Blob对象", vttBlob);
  return URL.createObjectURL(vttBlob);
}

//规范化 将sub对象的秒数转为time时间轴类型分别拿出来 映射成localstorage的存储模型
export function mapSubToFullModel(sub) {
  //小数点后补零 没有小数点则不补
  const fStartTime = formateTime(sub.startTime);
  const fEndTime = formateTime(sub.endTime);
  return {
    start: toNumber(fStartTime),
    startTime: fStartTime,
    end: toNumber(fEndTime),
    endTime: fEndTime,
    length: getTimeLength(fStartTime, fEndTime),
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

//把sub数组从localstorage中删除
export function cleanSubArray() {
  localStorage.removeItem(subArrayKey);
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

//处理开始时间 和 结束时间的 格式， 需要一个已经受过输入校验的time
function formateTime(validatedTime) {
  //针对开始和结束时间 小数点后补零 正则表达式捕获
  const timeRegx = /^(\d+:[0-5][0-9]:[0-5][0-9])(\.[0-9]{1,3})?$/;
  const found = validatedTime.match(timeRegx);
  //有小数点
  if (found && found[2]) {
    let str = found[2];
    while (str.length < 4) {
      str += "0";
    }
    return found[1] + str;
  }
  //无小数点
  if (found && found[1]) {
    return found[1];
  }
  //未找到 说明time不符合规范 暂时这么处理
  return "00:00:00";
}

//得到字幕的时间长度
export function getSubLength(sub) {
  //需要先校验startTime和endTime的格式是否正确
  const schema = {
    startTime: validateService.schema["startTime"],
    endTime: validateService.schema["endTime"]
  };
  const error = validateService.validate(sub, schema, { abortEarly: true });
  if (error) {
    return sub.length;
  } else {
    return getTimeLength(formateTime(sub.startTime), formateTime(sub.endTime));
  }
}

//将字幕数组 转为 vtt格式的字符串， 即text文本
export function mapSubArray2Text(subArray) {
  // subArray的格式必须符合存储规范
  const vttCueStrArray = subArray.map(
    (sub, index) =>
      `${index + 1}
${sub.startTime} --> ${sub.endTime}
${sub.content}
`
  );
  const vttText = "WEBVTT\n\n" + vttCueStrArray.join("\n");
  logger.clog(vttText);
  return vttText;
}

//通过url 下载文件
export function downloadFromUrl(url, fileName) {
  //创建一个a标签
  const aLink = document.createElement("a");
  //设为不可见
  aLink.style.display = "none";
  //将a标签的href设为url
  aLink.href = url;
  //a标签的download属性 设置文件名 ，浏览器将自动检测正确的文件类型
  aLink.download = fileName;
  //放入body里
  document.body.appendChild(aLink);
  //点击a标签
  aLink.click();
  //从body中移除a标签
  document.body.removeChild(aLink);
}

//下载编辑好的字幕文件 从存储中读取
export async function downloadSubFile() {
  try {
    //从存储中拿到字幕数组
    const subArray = await getSubArray();
    //当读取到的subArray是null 或者为空数组时 返回false
    if (!subArray || subArray.length === 0) return false;
    //将数组转为vtt格式的字符串
    const vttText = mapSubArray2Text(subArray);
    //由字符串 转为vtt Blob文件对象 然后创建url
    const url = createVttSubBlobUrl(vttText);
    //设置文件名 通过url 下载字幕文件
    downloadFromUrl(url, "字幕.vtt");
    //返回true 表示下载事件响应成功
    return true;
  } catch (e) {
    logger.clog("下载字幕出错：", e);
    //下载失败 抛出异常
    throw e;
  }
}

//返回一个默认的初始字幕 给定开始和结束时间 时长根据条件变化
export function getDefaultSub(startTime, endTime) {
  logger.clog("插入参数：", startTime, endTime, typeof (startTime + endTime));
  //默认文本
  const defaultContent = "默认文本";
  //默认的开始 结束 的秒数
  let defaultStart = 0;
  let defaultEnd = 0.001;
  //当发现传入的两个参数都是Number时
  if (typeof (startTime + endTime) === "number") {
    defaultStart = Number(startTime.toFixed(3));
    defaultEnd = Number(endTime.toFixed(3));
    return new Sub(defaultStart, defaultEnd, defaultContent);
  }
  //不是number，则为字符串 校验传入的 时间轴类型
  const startIsErr = validateService.validateTime(startTime);
  const endIsErr = validateService.validateTime(endTime);
  //如果通过校验
  if (!startIsErr && !endIsErr) {
    //格式化后 转为秒数
    defaultStart = toNumber(formateTime(startTime));
    defaultEnd = toNumber(formateTime(endTime));
  }
  //不是number 可能通过校验
  return new Sub(defaultStart, defaultEnd, defaultContent);
}

const subService = {
  readSubFileAsText,
  createSubArray,
  createVttSubBlobUrl,
  mapSubToFullModel,
  saveSubArray,
  cleanSubArray,
  getSubArray,
  getSubLength,
  mapSubArray2Text,
  downloadFromUrl,
  downloadSubFile,
  getDefaultSub,
  toTime,
  toNumber,
  getTimeLength
};

export default subService;
