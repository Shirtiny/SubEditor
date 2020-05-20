import axios from "axios";

//https://github.com/axios/axios

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
