import Sub from "../model/sub";
import timeFormatter from "../utils/timeFormatter";

//PromiseExecutor
function readAsTextPromiseExecutor(resolve, reject, file) {
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

export async function readSubFileAsText(subFile) {
  let text = "";
  try {
    text = await new Promise((resolve, reject) =>
      readAsTextPromiseExecutor(resolve, reject, subFile)
    );
  } catch (e) {
    console.log("字幕文件读取失败；", e);
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
    console.log("字幕装载失败：", e);
    e.message = "字幕装载失败";
    throw e;
  }
  const VTTCues = Array.from(subCues || {});
  console.log("得到VTTCues数组：", VTTCues);
  const subArray = VTTCues.map(c => {
    return new Sub(c.startTime, c.endTime, c.text);
  });
  console.log("得到字幕数组：", subArray);
  return subArray;
}

//创建vtt字幕的Blob对象 方便track分析 参数为vtt格式的字符串 返回该对象的url
export function createVttSubBlobUrl(vttStr) {
  const vttBlob = new Blob([vttStr], {
    type: "text/vtt"
  });
  console.log("vtt字幕Blob对象", vttBlob);
  return URL.createObjectURL(vttBlob);
}

const subService = {
  readSubFileAsText,
  createSubArray,
  createVttSubBlobUrl
};

export default subService;
