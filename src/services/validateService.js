import Joi from "joi-browser";
import _ from "lodash";
import logger from "../utils/logger";

// 00:00:29.320
const timeRegx = /^\d+:[0-5][0-9]:[0-5][0-9](\.[0-9]{1,3})?$/;

const schema = {
  startTime: Joi.string()
    .regex(timeRegx)
    .required()
    .min(8)
    .label("开始时间"),
  endTime: Joi.string()
    .regex(timeRegx)
    .required()
    .min(8)
    .label("结束时间"),
  content: Joi.string()
    .required()
    .max(100)
    .min(1)
    .label("文本内容"),
  start: Joi.number(),
  end: Joi.number(),
  length: Joi.number().greater(0)
};

//错误提示 模版
const errorSchema = {
  startTime: "格式如 00:00:29.320格式，可以不带小数，最少8个字符",
  endTime: "格式如 00:00:29.320，可以不带小数，最少8个字符",
  content: "需要在1-100个字符之间，不能为空",
  start: "必须为数字",
  end: "必须为数字",
  length: "不能为负值或0，开始时间要大于结束时间"
};

//全局 变量 和 变量名 的对应
const labelSchema = {
  startTime: "开始时间",
  endTime: "结束时间",
  content: "字幕文本内容",
  start: "起始秒数",
  end: "结束秒数",
  length: "时长"
};

export function getEditingSubSchema() {
  return {
    startTime: schema.startTime,
    endTime: schema.endTime,
    content: schema.content,
    start: schema.start,
    end: schema.end,
    length: schema.length
  };
}

export function getEditingErrorSchema() {
  return {
    startTime: errorSchema.startTime,
    endTime: errorSchema.endTime,
    content: errorSchema.content,
    start: errorSchema.start,
    end: errorSchema.end,
    length: errorSchema.length
  };
}

const defaultOption = {
  //配置项 关闭提前中断 收集所有错误
  abortEarly: false,
  //允许对象拥有其他的未知属性
  allowUnknown: true,
  //忽略具有函数值的未知键
  skipFunctions: true
};

//全属性校验
export function validate(obj, schema, config) {
  // https://www.jianshu.com/p/e6e277c1fda2
  const option = {
    ...defaultOption,
    ...config
  };
  const result = Joi.validate(obj, schema, option).error;
  //无错误 暂时返回false 表示通过校验 无错误
  if (!result) return false;
  //有错误 则返回一个出错的属性path数组
  logger.clog("editingSub校验结果，出现的错误：", result);
  let errorPaths = [];
  result.details.map(d => errorPaths.push(d.path[0]));
  //去除重复的值
  return _.uniq(errorPaths);
}

//单属性校验
export function validateProperty(name, value, sigleSchema, config) {
  const obj = { [name]: value };
  const option = {
    ...defaultOption,
    abortEarly: true,
    ...config
  };
  const result = Joi.validate(obj, sigleSchema, option).error;
  //有错误 则返回true
  return result ? true : false;
}

//将errors对象 转为errorMessages 可读的数组
export function errors2messages(errors) {
  if (!errors) return [];
  const keys = Object.keys(errors);
  const errorMessages = keys.map(key => {
    return labelSchema[key] + ": " + errors[key];
  });
  if (errorMessages.length === 0) {
    errorMessages.push(" ");
  }
  //返回消息数组
  return errorMessages;
}

const validateService = {
  getEditingSubSchema,
  getEditingErrorSchema,
  validate,
  validateProperty,
  errors2messages
};

export default validateService;
