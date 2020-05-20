import httpService from "../services/httpService";
import md5 from "js-md5";
import _ from "lodash";
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
baiduTranslateParams.append("from", "auto");
//百度翻译 函数
export function baiduTranslate(lang, text) {
  const salt = new Date().getTime();
  const sign = md5(`${baiduTranslateAppid}${text}${salt}${baiduTranslateKey}`);
  baiduTranslateParams.set("salt", salt);
  baiduTranslateParams.set("sign", sign);
  baiduTranslateParams.set("to", lang);
  baiduTranslateParams.set("q", text);

  // const encodeHref = Base64.encodeURI(url.href);这个方法编码出的base64结尾没有=
  const encodeHref = Base64.btoa(baiduTranslateUrl.href);
  httpService
    .get(`https://shproxy.herokuapp.com/shProxyApi/v1/get?url=${encodeHref}`)
    .then((res) => {
      console.log("百度翻译：", res);
    })
    .catch((e) => console.log(e));
}

//百度翻译 目标语言列表 (Object)
const baiduTranslateLanguages = {
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

//传入key值
export function translateByLangKey(langKey) {
  if (!baiduTranslateLanguages[langKey]) return;
}

const translater = {
  googleTranslate,
  baiduTranslate,
  getBaiduTranslateLangKey,
  getBaiduTranslateLanguages,
  translateByLangKey,
};

export default translater;
