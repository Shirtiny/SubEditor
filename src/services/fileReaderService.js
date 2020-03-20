function readerPromiseExecutor(resolve, reject, file) {
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

export function readSubFile(subFile) {
  return new Promise((resolve, reject) =>
    readerPromiseExecutor(resolve, reject, subFile)
  );
}

const fileReader = {
  readSubFile
};

export default fileReader;
