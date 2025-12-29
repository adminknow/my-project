<!-- 题目详情弹窗 -->
<template>
    <el-dialog title="素材列表" v-model="dialogVisible" width="52%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div style="width:100%;height: 10px;"></div>
        <el-form label-width="120px">
            <div class="search">
                <el-row>
                    <el-col :span="24">
                        <el-button type="primary" @click="handleSearch">
                            <el-icon style="vertical-align: middle">
                                <Search />
                            </el-icon>
                            <span style="vertical-align: middle">搜索</span>
                        </el-button>
                        <el-input style="width:30%;padding-left: 10px;" placeholder="请输入关键字查询"
                            v-model="SearchCondition.search_keyword" clearable />
                    </el-col>
                </el-row>
            </div>
            <div style="width:100%;height: 10px;"></div>
            <el-table :data="tableData" border style="width: 100%" :loading="loading"
                :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="VideoTitle" align="center" label="主标题"></el-table-column>
                <el-table-column align="center" label="创建时间">
                    <template #default="scope">
                        {{ scope.row.Ext_Response.Ext_CreateTimeStr }}
                    </template>
                </el-table-column>
                <el-table-column prop="UnitStatus" align="center" label="状态" width="120">
                    <template #default="scope">
                        {{ scope.row.Ext_Response.Ext_ResponseStatusDesc }}
                    </template>
                </el-table-column>
            </el-table>
            <!-- 主表格分页 -->
            <pagination-component v-model:current-page="pagination.PageStartRow"
                v-model:page-size="pagination.PageRowCount" :total="pagination.pageTotal" :page-sizes="[15, 50, 100]"
                @page-change="handlePageChange" @size-change="handleSizeChange" />
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" :loading="loading" @click="onSubmit">
                    <p>保 存</p>
                </el-button>
                <el-button class="button2" @click="handleClose()">关 闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import {
    ref,
    reactive,
    toRefs,
    watch,
    computed
} from "vue";
import { ElMessage } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import paginationComponent from "@/components/table/pagination.vue";
import { SearchVideoResponses } from "@/api/common.js";
// 定义组件属性
const props = defineProps({
    visible: Boolean,
});
const SearchCondition = reactive({
    search_keyword: "",
});
const multipleSelection = ref([]);//选中的数据
const tableData = ref([]);
// 分页配置
const pagination = reactive({
    PageStartRow: 1,
    PageRowCount: 15,
    pageTotal: 0,
});
// 从属性中解构
const { visible } = toRefs(props);
const loading = ref(false);

const dialogVisible = ref(false);
const emit = defineEmits(["closeVisible"]);
// 初始化数据
const SearchVideoResponsesApi = async () => {
    if (loading.value) return;
    loading.value = true;
    const res = await SearchVideoResponses({
        SearchCondition: SearchCondition,
        PageStartRow: (pagination.PageStartRow - 1) * pagination.PageRowCount,
        PageRowCount: pagination.PageRowCount,
    })
    loading.value = false;
    if (res.Code == 200) {
        tableData.value = res.DataMap;
        pagination.pageTotal = res.DataMap[0].DataCount
    }
}
// 分页导航
const handlePageChange = (val) => {
    pagination.PageStartRow = val;
    SearchVideoResponsesApi();
};
const handleSizeChange = (val) => {
    pagination.PageRowCount = val;
    SearchVideoResponsesApi();
};
const handleSearch = () => {
    pagination.PageStartRow = 1;
    SearchVideoResponsesApi();
}
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
    console.log(multipleSelection.value)
}
const onSubmit = async () => {
    if (multipleSelection.value.length == 0) {
        ElMessage.error("请先选择数据！");
        return
    }
    emit("closeVisible", {
        op: 'save',
        data: multipleSelection.value
    });
};

const handleClose = () => {
    emit("closeVisible", {
        op: 'cannel',
    });
};
// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (newValue) {
            SearchVideoResponsesApi()
        }
    }
);
</script>
