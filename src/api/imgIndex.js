import axios from "axios";
import md5 from "js-md5";
import Cookie from "js-cookie";
// console.log(process.env);
const service = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
});

// 创建axios实例
// const service = axios.create({
//     baseURL: process.env.VUE_APP_BASE_URL,
//     timeout: 10000
// });

// request拦截器
service.interceptors.request.use(
  // 在发送请求之前做些什么
  (config) => {
    // let scret = md5('cnew9hcsnzoer');
    config.headers["zy-call-app-id"] = `${import.meta.env.VITE_APP_BASE_API}`;
    const Token = Cookie.get("CookieToken");
    var token = "";
    if (Token) {
      token = Token;
    }
    var num = Date.parse(new Date()) / 1000;
    config.headers["zy-token"] = token; // 请求头中添加tokenid
    config.data.set("CallAppId", `${import.meta.env.VITE_APP_BASE_API}`);
    config.data.set("Timestamp", num);
    config.data.set("Nonce", num);
    debugger;
    config.headers["zy-sign"] = md5(
      "call_app_id=" +
        `${import.meta.env.VITE_APP_BASE_API}` +
        "&nonce=" +
        num +
        "&time_stamp=" +
        num +
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
      }
      if (response.data.Code == "10103") {
        Cookie.remove("CookieToken");
      }
      return response.data;
    } else {
      Promise.reject(new Error("error"));
    }
  },
  (error) => {
    if (JSON.stringify(error).includes("10109")) {
      // alert("登录已过期，请重新登录！");
      // this.$router.push('/login');
    } else {
      alert(error);
    }
    return Promise.reject(error);
  }
);
export default service;
