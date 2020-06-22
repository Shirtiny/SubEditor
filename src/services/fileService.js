//PromiseExecutor 将文件读取为ArrayBuffer
function readFilePE(resolve, reject, file, readerFnName) {
  const reader = new FileReader();
  // reader.readAsArrayBuffer(file);
  // reader.
  reader[readerFnName](file);
  //出错时
  reader.onerror = (e) => {
    reject(e);
  };
  //读取完成时 成功/失败
  reader.onload = () => {
    //失败时 rs为null
    resolve(reader.result);
  };
}

export async function readFileData(file) {
  let buffer = 0;
  try {
    buffer = await new Promise((resolve, reject) =>
    readFilePE(resolve, reject, file, "readAsArrayBuffer")
    );
  } catch (e) {
    console.log("文件读取失败", e);
  }
  return new Uint8Array(buffer);
}

export async function fetchAsBlob(url) {
  const res = await fetch(url);
  return await res.blob();
}

export async function fetchFileData(url) {
  const blob = await fetchAsBlob(url);
  console.log("fetched blob:", blob);
  return await readFileData(blob);
}

//合并 比如：传入两个unit8数组
export function merge(...buffers) {
  //获取第一个unit数组的构造函数
  const Constructor = buffers[0].constructor;
  return buffers.reduce((pre, val) => {
    //新建一个数组 长度为两个数组的长度和
    const merge = new Constructor((pre.byteLength | 0) + (val.byteLength | 0));
    merge.set(pre, 0);
    merge.set(val, pre.byteLength | 0);
    return merge;
  }, new Constructor());
}

function fetchFileU8DataPE(resove, reject, url) {
  let abortController = new AbortController();
  let reader = null;
  fetch(url, { signal: abortController.signal }).then((res) => {
    //如果res.body是流
    if (res.body && typeof res.body.getReader === "function") {
      //获取 ReadableStream 的 reader , ReadableStream接口呈现了一个可读取的二进制流操作 Fetch 通过Response的属性 body提供了一个具体的 ReadableStream 对象。
      reader = res.body.getReader();
      // 8位无符号整型数组 Uint8Array与可读流ReadableStream 的协同用法。
      let data = new Uint8Array();
      //使用reader读取二进制数据  "done"是一个布尔型，"value"是一个Unit8Array
      reader.read().then(function read({ done, value }) {
        if (done) {
          abortController.abort();
          reader.cancel();
          abortController = null;
          reader = null;
          resove(data);
          return;
        }
        //合并两个unit8数组 (累加data
        data = merge(data, value);
        //递归
        return reader.read().then(read);
      });
    } else {
      reject("res.body不是流");
    }
  });
}

export async function fetchFileU8Data(url) {
  let data = new Uint8Array();
  try {
    data = await new Promise((resolve, reject) =>
      fetchFileU8DataPE(resolve, reject, url)
    );
  } catch (e) {
    console.log("文件读取失败", e);
  }
  return data;
}

export async function fetchFileAsText(url) {
  const blob = await fetchAsBlob(url);
  console.log("fetched blob:", blob);
  let text = "";
  try {
    text = await new Promise((resolve, reject) =>
    readFilePE(resolve, reject, blob, "readAsText")
    );
  } catch (e) {
    console.log("文件读取失败", e);
  }
  return text;
}

//通过url 下载文件给用户
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

const fileService = {
  readFileData,
  fetchFileData,
  fetchFileAsText,
  fetchFileU8Data,
  downloadFromUrl
};

export default fileService;
