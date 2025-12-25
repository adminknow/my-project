<!-- 调查问卷 -->
<template>
    <div>
        <breadcrumb-component :title="'调查问卷'"></breadcrumb-component>
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
                        <el-button type="primary">
                            <el-icon style="vertical-align: middle">
                                <Plus />
                            </el-icon>
                            <span style="vertical-align: middle">新增</span>
                        </el-button>
                        <el-input style="width:30%;padding-left: 10px;" placeholder="请输入关键字查询"
                            v-model="SearchCondition.user_keyword" clearable />
                    </el-col>
                </el-row>
            </div>
            <div style="width:100%;height: 10px;"></div>
            <el-table :data="tableData" border style="width: 100%" :loading="loading"
                :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
                <el-table-column prop="ExamTitle" align="center" label="问卷标题"></el-table-column>
                <el-table-column prop="ExamDesc" align="center" label="描述"></el-table-column>
                <el-table-column prop="Ext_BeginTimeStr" align="center" label="开始时间"></el-table-column>
                <el-table-column prop="Ext_EndTimeStr" align="center" label="结束时间"></el-table-column>
                <el-table-column align="center" label="记录" width="160">
                    <template #default="scope">
                        <div class="left_align">参加人数：{{ scope.row.Ext_TotalTestStaffCount }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="Ext_ExamStatusDesc" align="center" label="状态" width="100">
                </el-table-column>
                <el-table-column align="center" label="操作" width="160">
                    <template #default="scope">
                        <div class="btn-css" style="">
                            <el-button size="small" type="primary" text
                                @click="handleEdit(scope.row.ExamID)">编辑</el-button>
                            <el-button @click="handleStop(scope.row.ExamID)" v-if="scope.row.ExamStatus == 1"
                                size="small" type="primary" text>停用</el-button>
                            <el-button @click="handleEnable(scope.row.ExamID)" v-if="scope.row.ExamStatus == 0"
                                size="small" type="primary" text>启用</el-button>
                            <el-button text size="small" type="primary"
                                @click="eChartsView(scope.row.ExamID)">问卷报表</el-button>
                            <el-button text size="small" type="primary"
                                @click="miniProgramView(scope.row.ExamID)">小程序预览</el-button>
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
import { SearchExams, DisableExam, EnableExam } from "@/api/common.js";
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
    user_keyword: "",
    exam_type: 1,
    get_total_staff_count: 1,
    get_total_test_staff_count: 1,

});
// 初始化数据
const SearchVideoResponsesApi = async () => {
    if (loading.value) return;
    loading.value = true;
    const res = await SearchExams({
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
const handleEdit = (id) => {
    router.push({
        path: "/investigateInfo",
        query: {
            pageType: 'edit',
            ExamType: 1,//类型(0:考卷;1:问卷调查)
            ID: id,
        },
    });
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
const handleEnable = (ID) => {
    ElMessageBox.confirm("确认启用？", "提示", {
        type: "warning",
        cancelButtonClass: "button2",
        confirmButtonClass: "button1",
    }).then(async () => {
        let res = await EnableExam({
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