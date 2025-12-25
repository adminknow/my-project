// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Cookie from "js-cookie";
const routes = [
  {
    path: "/login",
    component: () => import("../views/login.vue"),
    hidden: true,
    meta: { title: "登陆" },
  },
  {
    path: "/",
    name: "首页",
    component: () => import("@/components/Home.vue"),
    children: [
      {
        path: "/home",
        component: () => import("@/views/Home.vue"),
        meta: { title: "首页" },
      },
      {
        path: "/right",
        component: () => import("@/views/basic/right.vue"),
        meta: { title: "权限" },
      },
      {
        path: "/rightInfo",
        component: () => import("@/views/basic/rightInfo.vue"),
        meta: { title: "权限详情" },
      },
      {
        path: "/role",
        component: () => import("@/views/basic/role.vue"),
        meta: { title: "角色" },
      },
      {
        path: "/roleInfo",
        component: () => import("@/views/basic/roleInfo.vue"),
        meta: { title: "角色详情" },
      },
      {
        path: "/user",
        component: () => import("@/views/basic/user.vue"),
        meta: { title: "用户" },
      },
      {
        path: "/userInfo",
        component: () => import("@/views/basic/userInfo.vue"),
        meta: { title: "用户详情" },
      },
      {
        path: "/company",
        component: () => import("@/views/basic/company.vue"),
        meta: { title: "公司", page: 3 },
      },
      {
        path: "/depart",
        component: () => import("@/views/basic/depart.vue"),
        meta: { title: "部门", page: 4, unitType: 5 },
      },
      {
        path: "/staffs",
        component: () => import("@/views/basic/staffs.vue"),
        meta: { title: "员工" },
      },
      {
        path: "/company_investigate",
        component: () => import("@/views/basic/company.vue"),
        meta: { title: "公司（调查问卷）", page: 5 },
      },
      {
        path: "/depart_investigate",
        component: () => import("@/views/basic/depart.vue"),
        meta: { title: "部门（调查问卷）", page: 6, unitType: 5 },
      },
      {
        path: "/test",
        component: () => import("@/views/activity/test.vue"),
        meta: { title: "考试" },
      },
      {
        path: "/testInfo",
        component: () => import("@/views/activity/testInfo.vue"),
        meta: { title: "详情" },
      },
      {
        path: "/PDF",
        component: () => import("@/views/activity/PDF.vue"),
        meta: { title: "学习资料" },
      },
      {
        path: "/PDFInfo",
        component: () => import("@/views/activity/PDFInfo.vue"),
        meta: { title: "学习资料详情" },
      },
      {
        path: "/job",
        component: () => import("@/views/activity/job.vue"),
        meta: { title: "通知发送" },
      },
      {
        path: "/investigate",
        component: () => import("@/views/activity/investigate.vue"),
        meta: { title: "调查问卷" },
      },
      {
        path: "/investigate",
        component: () => import("@/views/activity/investigate.vue"),
        meta: { title: "调查问卷" },
      },
      {
        path: "/investigateInfo",
        component: () => import("@/views/activity/investigateInfo.vue"),
        meta: { title: "调查问卷详情" },
      },
      {
        path: "/task",
        component: () => import("@/views/activity/task.vue"),
        meta: { title: "任务" },
      },
      {
        path: "/system",
        component: () => import("@/views/activity/system.vue"),
        meta: { title: "系统配置" },
      },
      {
        path: "/video",
        component: () => import("@/views/activity/video.vue"),
        meta: { title: "视频素材" },
      },
      {
        path: "/videoInfo",
        component: () => import("@/views/activity/videoInfo.vue"),
        meta: { title: "视频素材" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  // 认证优先
  const token = Cookie.get("CookieToken");
  if (!token && to.path !== "/login") {
    return next("/login");
  }
  next();
});
export default router;
