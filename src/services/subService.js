//PromiseExecutor
function readAsTextPromiseExecutor(resolve, reject, file) {
  const reader = new FileReader();
  reader.readAsText(file);
  //出错时触发
  reader.onerror = error => {
    console.log("读取出错", error);
    reject(error);
  };
  //读取完成时 成功或失败 触发
  reader.onload = () => {
    console.log("读取完成，成功或失败", reader);
    //读取失败时 result为null
    resolve(reader.result);
  };
}

export function readSubFileAsText(subFile) {
  return new Promise((resolve, reject) =>
    readAsTextPromiseExecutor(resolve, reject, subFile)
  );
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
    console.log("字幕装载失败：", error);
    reject(error);
  };
  //执行完成后 成功或失败
  $track.onload = () => {
    console.log("执行完成，成功或失败：", $track);
    //返回cues对象
    resolve($track.track.cues);
  };
}

//创建字幕数组 参数是一个vtt字幕文件的url
export async function createSubArray(subUrl) {
  const subCues = await new Promise((resolve, reject) =>
    analyseSubPE(resolve, reject, subUrl)
  );
  const subArray = Array.from(subCues);
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
