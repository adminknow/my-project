<!-- 角色 -->
<template>
    <div>
        <breadcrumb-component :title="'角色'" urlPath="/role"></breadcrumb-component>
        <div class="container">
            <div class="search">
                <el-row>
                    <el-col :span="1">
                        <el-button type="primary" @click="handleSearch">
                            <el-icon style="vertical-align: middle">
                                <Search />
                            </el-icon>
                            <span style="vertical-align: middle">搜索</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-input placeholder="请输入关键字查询" v-model="SearchCondition.search_keyword" clearable />
                    </el-col>
                </el-row>
            </div>
            <div style="width:100%;height: 10px;"></div>
            <el-table :data="tableData" border style="width: 100%" :loading="loading"
                :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
                <el-table-column align="center" prop="RoleCode" label="角色编码" width="180" />
                <el-table-column align="center" prop="RoleName" label="角色名称" />
                <el-table-column align="center" prop="Description" label="描述" />
                <el-table-column align="center" label="操作" width="160">
                    <template #default="scope">
                        <el-button size="small" type="primary" text>编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 主表格分页 -->
            <!-- <pagination-component v-model:current-page="pagination.PageStartRow"
                v-model:page-size="pagination.PageRowCount" :total="pagination.pageTotal" :page-sizes="[15, 50, 100]"
                @page-change="handlePageChange" @size-change="handleSizeChange" /> -->
        </div>
    </div>
</template>
<script setup>
import breadcrumbComponent from "@/components/common/breadcrumb.vue";
import paginationComponent from "@/components/table/pagination.vue";
import { Search } from '@element-plus/icons-vue'
import { ref, reactive } from "vue";
import { SearchRoles } from "@/api/common.js";
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
const SearchRolesApi = async () => {
    if (loading.value) return;
    loading.value = true;
    const res = await SearchRoles({
        SearchCondition: SearchCondition,
        PageStartRow: (pagination.PageStartRow - 1) * pagination.PageRowCount,
        PageRowCount: pagination.PageRowCount,
    })
    loading.value = false;
    if (res.Code == 200) {
        tableData.value = res.DataMap;
    }
}

// 分页导航
const handlePageChange = (val) => {
    pagination.PageStartRow = val;
    SearchRolesApi();
};
const handleSizeChange = (val) => {
    pagination.PageRowCount = val;
    SearchRolesApi();
};
const handleSearch = () => {
    pagination.PageStartRow = 1;
    SearchRolesApi();
}
const init = () => {
    SearchRolesApi();
};
init();
</script>
<style scoped></style>