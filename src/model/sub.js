import subService from "../services/subService";

class Sub {
  //start是秒数 如32秒 startTime是时间轴的形式 如 00:00:32
  constructor(start, end, content) {
    // number number string
    this.start = Number(start.toFixed(3));
    this.end = Number(end.toFixed(3));
    this.content = content;
    this.editing = false;
  }

  get startTime() {
    return subService.toTime(this.start);
  }

  get endTime() {
    return subService.toTime(this.end);
  }

  get length() {
    return Number((this.end - this.start).toFixed(3));
  }
}

export default Sub;
