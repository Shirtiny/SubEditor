import DT from "duration-time-conversion";
// import logger from "./logger";

export function number2Time(number) {
  const fixedNum = number.toFixed(3);
  const time = DT.d2t(fixedNum);
  //   logger.clog("转换为时间轴的值：", time);
  return time;
}

export function time2Number(time) {
  // logger.clog(time, DT.t2d(time).toFixed(3));
  return DT.t2d(time).toFixed(3);
}

export function getTimeLength(startTime, endTime) {
  return (DT.t2d(endTime) - DT.t2d(startTime)).toFixed(3);
}

const timeFormatter = {
  number2Time,
  time2Number,
  getTimeLength
};

export default timeFormatter;
