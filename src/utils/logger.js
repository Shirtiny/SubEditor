import config from "../config/config.json";

//当配置项是off时，关闭log。当不为off或者为空时 显示log
let displayLogOff = config.log === "off" ? true : false;

export function clog(...rest) {
  if (displayLogOff) return;
  console.log(...rest);
}

const logger = {
  clog
};

export default logger;
