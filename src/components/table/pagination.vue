<template>
    <div class="pagination">
        <el-pagination background layout="->,total, sizes, prev, pager, next" v-model:current-page="currentPage"
            v-model:page-size="pageSize" :page-sizes="pageSizes" :total="total" :disabled="disabled"
            @current-change="handleCurrentChange" @size-change="handleSizeChange" />
    </div>
</template>

<script setup>
import { computed, toRefs } from "vue";

// 定义组件属性
const props = defineProps({
    // 当前页码
    currentPage: {
        type: Number,
        default: 1,
    },
    // 每页显示条数
    pageSize: {
        type: Number,
        default: 15,
    },
    // 总条数
    total: {
        type: Number,
        default: 0,
    },
    // 每页显示个数选择器的选项设置
    pageSizes: {
        type: Array,
        default: () => [15, 50, 100],
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false,
    },
    // 自定义布局
    layout: {
        type: String,
        default: "->,total, sizes, prev, pager, next",
    },
    // 是否显示背景色
    background: {
        type: Boolean,
        default: true,
    },
    // 只有一页时是否隐藏
    hideOnSinglePage: {
        type: Boolean,
        default: false,
    },
});
const currentPage = defineModel('currentPage', { type: Number, default: 1 });
const pageSize = defineModel('pageSize', { type: Number, default: 15 });
// //使用父组件传递过来的值
const { total, pageSizes, disabled, layout, background, hideOnSinglePage } = toRefs(props);
// 定义事件
const emit = defineEmits([
    "update:currentPage",
    "update:pageSize",
    "page-change",
    "size-change",
]);

// 计算属性 - 是否显示分页器
const shouldShow = computed(() => {
    if (props.hideOnSinglePage && props.total <= props.pageSize) {
        return false;
    }
    return true;
});

// 处理页码变化
const handleCurrentChange = (val) => {
    emit("update:currentPage", val);
    emit("page-change", val);
};

// 处理每页条数变化
const handleSizeChange = (val) => {
    emit("update:pageSize", val);
    emit("size-change", val);
};
</script>
