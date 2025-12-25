<!-- 页面标题路由 -->
<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: urlPath }">
            <div style="display: flex; align-items: center;">
                <el-icon>
                    <Menu />
                </el-icon>
                <p style="padding-left: 4px;">{{ title }}</p>
            </div>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="subTitle">
            <p style="padding-left: 4px;">{{ subTitle }}</p>
        </el-breadcrumb-item>
    </el-breadcrumb>
    <div style="width:100%;height: 10px;"></div>
</template>

<script setup>
import { Menu } from '@element-plus/icons-vue'
import {
    ref,
    reactive,
    toRefs,
    watch,
    onMounted,
    computed,
} from "vue";
const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    subTitle: {
        type: String,
        default: "",
    },
    urlPath: {
        type: String,
        default: "",
    },
});
// //使用父组件传递过来的值
// 从属性中解构
const { } = toRefs(props);
</script>
<style lang="less"></style>
