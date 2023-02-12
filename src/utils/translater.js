import httpService from "../services/httpService";
import md5 from "js-md5";
import _ from "lodash";
import config from "../config/config.json";
import { Base64 } from "js-base64";

//非正式 不稳定
export function googleTranslate(lang, query) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.append("client", "gtx");
  url.searchParams.append("sl", "auto");
  url.searchParams.append("dt", "t");
  url.searchParams.append("tl", lang);
  url.searchParams.append("q", query);
  // console.log(url.href);
  httpService
    .get(
      "https://translate.googleapis.com/translate_a/single",
      url.searchParams
    )
    .then((res) => {
      console.log("谷歌翻译", res);
    });
}

//百度翻译 配置
const baiduTranslateUrl = new URL(
  "https://fanyi-api.baidu.com/api/trans/vip/translate"
);
const baiduTranslateAppid = "20180619000178085";
const baiduTranslateKey = "ZEg5rb06NeW4wNjslD6F";
const baiduTranslateParams = baiduTranslateUrl.searchParams;
baiduTranslateParams.append("appid", baiduTranslateAppid);

//百度翻译 函数 返回字符串，如果翻译结果为空 则返回空字符串
export function baiduTranslate(from, to, text) {
  console.log("百度翻译");
  const salt = new Date().getTime();
  const sign = md5(`${baiduTranslateAppid}${text}${salt}${baiduTranslateKey}`);
  baiduTranslateParams.set("salt", salt);
  baiduTranslateParams.set("sign", sign);
  baiduTranslateParams.set("from", from);
  baiduTranslateParams.set("to", to);
  baiduTranslateParams.set("q", text);

  console.log("baiduTranslateUrl.href", baiduTranslateUrl.href);

  const encodeHref = Base64.encodeURI(baiduTranslateUrl.href, true);
  return httpService
    .get(
      `http://manager.shirtiny.cn/api/v1/proxy/get?url=${encodeHref}`,
      {},
      {
        timeout: 60000,
      }
    )
    .then((res) => {
      console.log("百度翻译请求结果：", res);
      if (!res.data || !res.data.trans_result) {
        //抛出异常
        throw new Error("翻译出错");
      }
      //无结果时 返回空数组
      const resultTextArr =
        (res.data.trans_result && res.data.trans_result.map((o) => o.dst)) ||
        [];
      return resultTextArr;
    })
    .catch((e) => {
      //抛出异常
      throw new Error(e);
    });
}

//翻译
export function translate(from, to, text) {
  //这里用的是百度翻译 如果以后要换翻译服务商 注意translateByLangKey函数里用的是百度的语言key列表
  return baiduTranslate(from, to, text);
}

//限制调用 (首次立即调用，其后2秒内不会再次调用)
export const translateDebounce = _.debounce(translate, 2000, {
  leading: true,
  trailing: false,
});

//百度翻译 目标语言列表 (Object)
const baiduTranslateLanguages = {
  auto: "自动检测",
  zh: "中文",
  en: "英语",
  cht: "繁体中文",
  yue: "粤语",
  wyw: "文言文",
  jp: "日语",
  kor: "韩语",
  fra: "法语",
  spa: "西班牙语",
  th: "泰语",
  ara: "阿拉伯语",
  ru: "俄语",
  pt: "葡萄牙语",
  de: "德语",
  it: "意大利语",
  el: "希腊语",
  nl: "荷兰语",
  pl: "波兰语",
  bul: "保加利亚语",
  est: "爱沙尼亚语",
  dan: "丹麦语",
  fin: "芬兰语",
  cs: "捷克语",
  rom: "罗马尼亚语",
  slo: "斯洛文尼亚语",
  swe: "瑞典语",
  hu: "匈牙利语",
  vie: "越南语",
};

export function getBaiduTranslateLanguages() {
  return baiduTranslateLanguages;
}

//返回与值对应的key
export function getBaiduTranslateLangKey(value) {
  const key = _.findKey(baiduTranslateLanguages, (v) => v === value);
  console.log(key);
}

const translateArrSeparator = config.translate_arr_separator;
//将文本数组 组成 以 translateArrSeparator(\n) 分隔的一串文本
export function createTranslateTextFromStringArr(stringArr) {
  if (!stringArr || stringArr.length === 0) return "";
  return stringArr.join(translateArrSeparator);
}

//传入key值
export function translateByLangKey(fromKey, toKey, translateText) {
  if (!baiduTranslateLanguages[fromKey] || !baiduTranslateLanguages[toKey])
    return "";
  //执行翻译 防止频繁点击
  return translateDebounce(fromKey, toKey, translateText);
}

const translater = {
  googleTranslate,
  baiduTranslate,
  getBaiduTranslateLangKey,
  getBaiduTranslateLanguages,
  translateByLangKey,
  translateDebounce,
  createTranslateTextFromStringArr,
};

export default translater;
