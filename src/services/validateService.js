import Joi from "joi-browser";

const schema = {
  startTime: Joi.string()
    .required()
    .max(12)
    .min(8)
    .label("开始时间"),
  endTime: Joi.string()
    .required()
    .max(12)
    .min(8)
    .label("结束时间"),
  content: Joi.string()
    .required()
    .max(100)
    .min(1)
    .label("文本内容"),
  start: Joi.number(),
  end: Joi.number(),
  length: Joi.number()
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

export function validate(obj, schema, config) {
  // https://www.jianshu.com/p/e6e277c1fda2
  const option = {
    //配置项 关闭提前中断 收集所有错误
    abortEarly: false,
    //允许对象拥有其他的未知属性
    allowUnknown: true,
    //忽略具有函数值的未知键
    skipFunctions: true,
    ...config
  };
  return Joi.validate(obj, schema, option).error;
}

const validateService = {
  getEditingSubSchema,
  validate
};

export default validateService;
