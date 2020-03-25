import timeFormatter from "../utils/timeFormatter";

class Sub {
  //start是秒数 如32秒 startTime是时间轴的形式 如 00:00:32
  constructor(start, end, content) {
    // number number string
    this.start = start;
    this.end = end;
    this.content = content;
    this.editing = false;
  }

  get startTime() {
    return timeFormatter.number2Time(this.start);
  }

  get endTime() {
    return timeFormatter.number2Time(this.end);
  }

  get length() {
    return (this.end - this.start).toFixed(3);
  }
}

export default Sub;
