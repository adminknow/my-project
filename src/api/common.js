import axios from "@/api/request.js";
//登陆
export function login(data) {
  return axios({
    url: "/api/User/Login",
    method: "post",
    data,
  });
}
//获取菜单
export function GetMyMenuList(data) {
  return axios({
    url: "/api/Right/GetMyMenuList",
    method: "post",
    data,
  });
}
export function GetAppList(data) {
  return axios({
    url: "/api/Right/GetAppList",
    method: "post",
    data,
  });
}
export function GetSubRightList(data) {
  return axios({
    url: "/api/Right/GetSubRightList",
    method: "post",
    data,
  });
}
export function GetRight(data) {
  return axios({
    url: "/api/Right/GetRight",
    method: "post",
    data,
  });
}
export function SaveRight(data) {
  return axios({
    url: "/api/Right/SaveRight",
    method: "post",
    data,
  });
}
export function SearchRoles(data) {
  return axios({
    url: "/api/Right/SearchRoles",
    method: "post",
    data,
  });
}
export function SearchUsers(data) {
  return axios({
    url: "/api/User/SearchUsers",
    method: "post",
    data,
  });
}
export function GetUser(data) {
  return axios({
    url: "/api/User/GetUser",
    method: "post",
    data,
  });
}

export function SaveUser(data) {
  return axios({
    url: "/api/User/SaveUser",
    method: "post",
    data,
  });
}
export function GetUnitList(data) {
  return axios({
    url: "/api/Unit/GetUnitList",
    method: "post",
    data,
  });
}
//查询公司详情
export function GetUnit(data) {
  return axios({
    url: "/api/Unit/GetUnit",
    method: "post",
    data,
  });
}
export function SearchUnits(data) {
  return axios({
    url: "/api/Unit/SearchUnits",
    method: "post",
    data,
  });
}
export function SaveUnit(data) {
  return axios({
    url: "/api/Unit/SaveUnit",
    method: "post",
    data,
  });
}
export function SearchStaffs(data) {
  return axios({
    url: "/api/User/SearchStaffs",
    method: "post",
    data,
  });
}
//分页查询视频素材
export function SearchVideoResponses(data) {
  return axios({
    url: "/api/WX/SearchVideoResponses",
    method: "post",
    data,
  });
}
//停用单个素材
export function DisableResponse(data) {
  return axios({
    url: "/api/WX/DisableResponse",
    method: "post",
    data,
  });
}
//启用单个素材
export function EnableResponse(data) {
  return axios({
    url: "/api/WX/EnableResponse",
    method: "post",
    data,
  });
}
export function GetVideoResponse(data) {
  return axios({
    url: "/api/WX/GetVideoResponse",
    method: "post",
    data,
  });
}
export function SearchFileResponses(data) {
  return axios({
    url: "/api/WX/SearchFileResponses",
    method: "post",
    data,
  });
}
export function DeleteResponse(data) {
  return axios({
    url: "/api/WX/DeleteResponse",
    method: "post",
    data,
  });
}
export function SaveVideoResponse(data) {
  return axios({
    url: "/api/WX/SaveVideoResponse",
    method: "post",
    data,
  });
}
export function GetFileResponse(data) {
  return axios({
    url: "/api/WX/GetFileResponse",
    method: "post",
    data,
  });
}
export function SaveFileResponse(data) {
  return axios({
    url: "/api/WX/SaveFileResponse",
    method: "post",
    data,
  });
}
export function GetDictionaryDetailList(data) {
  return axios({
    url: "/api/Common/GetDictionaryDetailList",
    method: "post",
    data,
  });
}
export function SearchExams(data) {
  return axios({
    url: "/api/Exam/SearchExams",
    method: "post",
    data,
  });
}
export function DisableExam(data) {
  return axios({
    url: "/api/Exam/DisableExam",
    method: "post",
    data,
  });
}
export function EnableExam(data) {
  return axios({
    url: "/api/Exam/EnableExam",
    method: "post",
    data,
  });
}
//添加一个考试通知的定时作业
export function AddExamTestNotifyJob(data) {
  return axios({
    url: "/api/Job/AddExamTestNotifyJob",
    method: "post",
    data,
  });
}
export function GetExam(data) {
  return axios({
    url: "/api/Exam/GetExam",
    method: "post",
    data,
  });
}
export function SaveExam(data) {
  return axios({
    url: "/api/Exam/SaveExam",
    method: "post",
    data,
  });
}
export function SearchJobs(data) {
  return axios({
    url: "/api/Job/SearchJobs",
    method: "post",
    data,
  });
}
export function CancelJob(data) {
  return axios({
    url: "/api/Job/CancelJob",
    method: "post",
    data,
  });
}
export function SubmitJob(data) {
  return axios({
    url: "/api/Job/SubmitJob",
    method: "post",
    data,
  });
}
