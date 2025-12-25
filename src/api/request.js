import axios from "axios";
import md5 from "js-md5";
import Cookie from "js-cookie";
import router from "../router";

import { ElMessage, ElMessageBox } from "element-plus";
const service = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`, //环境变量（package.json 中定义的变量）
});
// request拦截器
service.interceptors.request.use(
  // 在发送请求之前做些什么
  (config) => {
    let dataValue = Date.parse(new Date()) / 1000;
    const Token = Cookie.get("CookieToken");
    var token = "";
    if (Token) {
      token = Token;
    }
    config.headers["zy-call-app-id"] = `${
      import.meta.env.VITE_APP_BASE_API
    }`; // 请求头中添加tokenid
    config.headers["zy-Token"] = token; // 请求头中添加tokenid
    config.headers["Content-Type"] = "application/json"; // 设置数据传输方式
    config.data.CallAppId = `${import.meta.env.VITE_APP_BASE_API}`;
    config.data.Timestamp = dataValue;
    config.data.Nonce = dataValue;
    config.headers["zy-sign"] = md5(
      "call_app_id=" +
        `${import.meta.env.VITE_APP_BASE_API}` +
        "&nonce=" +
        config.data.Nonce +
        "&time_stamp=" +
        config.data.Timestamp +
        "&call_app_secret=" +
        `${import.meta.env.VITE_CALL_APP_SECRET}`
    ); // 请求头中添加tokenid

    return config;
  },

  (error) => {
    Promise.reject(error);
  }
);
// response拦截器
//简单点说就是每次得到数据前都要经过这里
service.interceptors.response.use(
  (response) => {
    if (response) {
      if (response.data.Code == "10109") {
        Cookie.remove("CookieToken");
        response.data.Message = "登录已失效";
        router.push("login");
      }
      if (response.data.Code == "10103") {
        Cookie.remove("CookieToken");
        response.data.Message = "登录已失效";
        router.push("login");
      }
      return response.data;
    } else {
      Promise.reject(new Error("error"));
    }
  },
  (error) => {
    if (JSON.stringify(error).includes("10109")) {
    } else {
      alert(error);
    }
    return Promise.reject(error);
  }
);

export default service;
