<!-- src/components/Header.vue -->
<template>
  <div class="header">
    <div @click="toggleSidebar" style="font-size: 20px;display: flex;justify-content: center;align-items: center;">
      <el-icon>
        <Expand v-if="sidebarCollapsed" />
        <Fold v-else />
      </el-icon>
      <div class="title">后台管理系统</div>
    </div>
    <el-dropdown trigger="click" @command="handleCommand">
      <div class="user-info">
        <el-avatar :src="'https://zytest15.oss-cn-shanghai.aliyuncs.com/DL/home_header.png'" />
        <span style="margin-left: 10px;color: #fff;">{{ user.UnitName + '--' + user.UserName }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </div>
</template>

<script setup>
import { Expand, Fold } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import { storeToRefs } from 'pinia'
import Cookie from "js-cookie";
import { useRouter } from "vue-router";
const router = useRouter();
const layoutStore = useLayoutStore()
// 通过 storeToRefs 获取响应式引用
const { sidebarCollapsed } = storeToRefs(layoutStore)

const toggleSidebar = () => {
  layoutStore.toggleSidebar()
}
const user = JSON.parse(Cookie.get("User"));
const handleCommand = (command) => {
  if (command === "loginout") {
    router.push("/login");
  }
};
</script>

<style scoped>
.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 20px;
  background-color: #242f42;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 22px;
  font-weight: bold;
  margin-left: 8px;
}

.user-info {
  display: flex;
  align-items: center;
}
</style>