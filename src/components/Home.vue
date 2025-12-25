<!-- src/App.vue -->
<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 顶部 Header -->
    <Header />
    <el-container class="main-container">
      <!-- 主内容 -->
      <el-main class="main-area" :class="{ 'content-collapse': sidebarCollapsed }">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useLayoutStore } from '@/stores/layout'
import { computed } from 'vue'

const layoutStore = useLayoutStore()
const sidebarCollapsed = computed(() => layoutStore.sidebarCollapsed)
</script>

<style>
/* 布局整体 */
.layout {
  /* height: 100vh; */
  background: var(--el-color-info-light-9);
}



/* 主容器 */
.main-container {
  background: linear-gradient(180deg, #ffffff 0%, #f6f8fa 100%);
}

/* Header */
.header-wrapper {
  width: 100%;
  padding: 0 !important;
  height: 60px;
  display: flex;
  align-items: center;
  background: var(--el-color-white);
  box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.12), 0 4px 12px -4px rgba(0, 0, 0, 0.08);
  z-index: 10;
}

/* 主内容区 */
.main-area {
  position: absolute;
  left: 250px;
  right: 0;
  top: 70px;
  bottom: 0;
  padding-bottom: 30px;
  -webkit-transition: left .3s ease-in-out;
  transition: left .3s ease-in-out;
  background: #f0f0f0;
  padding: 10px;
}
.content-collapse{
      left: 65px;
}
/* 自定义滚动条（WebKit） */
.main-area::-webkit-scrollbar {
  width: 10px;
}

.main-area::-webkit-scrollbar-track {
  background: transparent;
}

.main-area::-webkit-scrollbar-thumb {
  background: var(--el-color-primary-light-7);
  border-radius: 6px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.main-area::-webkit-scrollbar-thumb:hover {
  background: var(--el-color-primary);
}

/* 响应式微调 */
@media (max-width: 960px) {
  .main-area {
    padding: 12px 12px 24px;
  }

  .header-wrapper {
    padding: 0 12px;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .layout {
    background: #1e1f24;
  }

  .sidebar {
    background: #26272c;
    border-right: 1px solid #2f3035;
  }

  .header-wrapper {
    background: #26272c;
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.6);
  }

  .main-area {
    background: linear-gradient(180deg, #26272c 0%, #1e1f24 100%);
  }

  .main-area::-webkit-scrollbar-thumb {
    background: #3a3b41;
  }

  .main-area::-webkit-scrollbar-thumb:hover {
    background: #4a4b52;
  }
}
</style>