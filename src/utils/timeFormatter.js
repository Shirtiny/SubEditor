import DT from "duration-time-conversion";

export function number2Time(number) {
  const fixedNum = number.toFixed(3);
  const time = DT.d2t(fixedNum);
  //   console.log("转换为时间轴的值：", time);
  return time;
}

const timeFormatter = {
  number2Time
};

export default timeFormatter;
