import httpService from "../services/httpService";
import md5 from "js-md5";
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
const baiduTranslateUrl = new URL("https://fanyi-api.baidu.com/api/trans/vip/translate");
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

const translater = {
  googleTranslate,
  baiduTranslate,
};

export default translater;
