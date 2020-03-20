import NProgress from "nprogress";

//默认配置
const defaultConfig = {
  minimum: 0.1
};
//初始化默认配置
NProgress.configure(defaultConfig);

function start(number) {
  return number ? NProgress.start().set(number) : NProgress.start();
}

function set(number) {
  return number && NProgress.set(number);
}

function inc(number) {
  return number && NProgress.inc(number);
}

function done() {
  NProgress.done();
}

const progressor = {
  start,
  set,
  inc,
  done
};

export default progressor;
