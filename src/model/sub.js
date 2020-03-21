import timeFormatter from "../utils/timeFormatter";

class Sub {
  //start是秒数 如32秒 startTime是时间轴的形式 如 00:00:32
  constructor(start, end, content) {
    this.start = start;
    this.end = end;
    this.content = content;
  }

  get startTime() {
    return timeFormatter.number2Time(this.start);
  }

  get endTime() {
    return timeFormatter.number2Time(this.end);
  }
}

export default Sub;
