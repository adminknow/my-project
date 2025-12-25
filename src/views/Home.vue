<!-- src/views/Home.vue -->
<template>
  <div>
    <h2>欢迎来到后台首页！</h2>
    <p>当前侧边栏状态：{{ collapsedText }}</p>
  </div>
</template>

<script setup>
import { useLayoutStore } from '@/stores/layout'
import { computed } from 'vue'

const layoutStore = useLayoutStore()
const collapsedText = computed(() => layoutStore.sidebarCollapsed ? '已折叠' : '展开')
</script>