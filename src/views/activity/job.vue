<!-- 通知发送 -->
<template>
    <div>
        <breadcrumb-component :title="'通知发送'"></breadcrumb-component>
        <div class="container">
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
                :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
                <el-table-column prop="JobName" align="center" label="任务名称"></el-table-column>
                <el-table-column prop="Ext_ExecuteTimeStr" align="center" label="执行时间"></el-table-column>
                <el-table-column prop="ExecuteResult" align="center" label="执行结果"></el-table-column>
                <el-table-column prop="Ext_ExecuteStatusDesc" align="center" label="状态"></el-table-column>
                <el-table-column align="center" label="操作" width="160">
                    <template #default="scope">
                        <div class="btn-css" style="">
                            <el-button size="small" type="primary" text
                                @click="handleSubmit(scope.row.JobID)">提交作业</el-button>
                            <el-button @click="handleStop(scope.row.JobID)"
                                v-if="scope.row.ExecuteStatus == 0 || scope.row.ExecuteStatus == 10 || scope.row.ExecuteStatus == 20"
                                size="small" type="primary" text>取消作业</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 主表格分页 -->
            <pagination-component v-model:current-page="pagination.PageStartRow"
                v-model:page-size="pagination.PageRowCount" :total="pagination.pageTotal" :page-sizes="[15, 50, 100]"
                @page-change="handlePageChange" @size-change="handleSizeChange" />
        </div>
    </div>
</template>
<script setup>
import breadcrumbComponent from "@/components/common/breadcrumb.vue";
import paginationComponent from "@/components/table/pagination.vue";
import { Search, Plus } from '@element-plus/icons-vue'
import { ref, reactive } from "vue";
import { SearchJobs, SubmitJob, CancelJob } from "@/api/common.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const loading = ref(false);
const tableData = ref([]);
// 分页配置
const pagination = reactive({
    PageStartRow: 1,
    PageRowCount: 15,
    pageTotal: 0,
});
//搜索条件
const SearchCondition = reactive({
    search_keyword: "",
});
// 初始化数据
const SearchVideoResponsesApi = async () => {
    if (loading.value) return;
    loading.value = true;
    const res = await SearchJobs({
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

const handleStop = (ID) => {
    ElMessageBox.confirm("确认停用？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await DisableExam({
            ExamID: ID,
        });
        if (res.Code == 200) {
            ElMessage.success("操作成功");
            handleSearch();
        } else {
            ElMessage.warning(res.Message);
        }
    });
};
const init = () => {
    SearchVideoResponsesApi();
};
init();
</script>
<style scoped></style>