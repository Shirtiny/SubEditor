import axios from "axios";
import progressor from "../utils/progressor";

//https://github.com/axios/axios

//请求拦截器
axios.interceptors.request.use(
  (config) => {
    progressor.start();
    return config;
  },
  (error) => {
    progressor.done();
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (res) => {
    progressor.done();
    return res;
  },
  (error) => {
    progressor.done();
    console.log("请求出错", error, error.response.status);
    return Promise.reject(error);
  }
);

/**
 * http get
 * @param {String} url
 * @param {Object} params 一个简单对象 或者 一个 URLSearchParams对象
 * @param {Object} config headers等配置
 */
export function get(url, params = {}, config = {}) {
  const axiosConfig = { params, ...config };
  return axios.get(url, axiosConfig);
}

/**
 *
 * @param {String} url
 * @param {*} data
 * @param {Object} config
 */
export function post(url, data = {}, config = {}) {
  return axios.post(url, data, config);
}

const httpService = {
  get,
  post,
};

export default httpService;
