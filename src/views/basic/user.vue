<!-- 用户页面 -->
<template>
    <div>
        <breadcrumb-component :title="'用户'" urlPath="/user"></breadcrumb-component>
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
                        <el-button type="primary" @click="handleAdd">
                            <el-icon style="vertical-align: middle">
                                <Plus />
                            </el-icon>
                            <span style="vertical-align: middle">新增</span>
                        </el-button>
                        <el-input style="width:30%;padding-left: 10px;" placeholder="请输入关键字查询" v-model="SearchCondition.search_keyword" clearable />
                    </el-col>
                </el-row>
            </div>
            <div style="width:100%;height: 10px;"></div>
            <el-table :data="tableData" border style="width: 100%" :loading="loading"
                :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
                <el-table-column prop="UserAccount" label="账号"></el-table-column>
                <el-table-column prop="UserName" label="姓名"></el-table-column>
                <el-table-column prop="StaffNo" label="工号"></el-table-column>
                <el-table-column prop="Ext_UserRoleStr" label="可访问角色"></el-table-column>
                <el-table-column prop="Ext_UserStatusDesc" label="状态"></el-table-column>
                <el-table-column prop="Ext_CreateTimeStr" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作" width="160">
                    <template #default="scope">
                        <el-button size="small" type="primary" text @click="handleEdit(scope.row.UserID)">编辑</el-button>
                        <el-button v-if="scope.row.UserStatus == 1" size="small" type="primary" text>停用</el-button>
                        <el-button v-if="scope.row.UserStatus == 0" size="small" type="primary" text>启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script setup>
import breadcrumbComponent from "@/components/common/breadcrumb.vue";
import { Search, Plus } from '@element-plus/icons-vue'
import { ref, reactive } from "vue";
import { SearchUsers } from "@/api/common.js";
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
const SearchUsersApi = async () => {
    if (loading.value) return;
    loading.value = true;
    const res = await SearchUsers({
        SearchCondition: SearchCondition,
        PageStartRow: (pagination.PageStartRow - 1) * pagination.PageRowCount,
        PageRowCount: pagination.PageRowCount,
    })
    loading.value = false;
    if (res.Code == 200) {
        tableData.value = res.DataMap;
    }
}
const handleSearch = () => {
    SearchUsersApi();
}
const handleAdd = () => {
    router.push({
        path: "/userInfo",
        query: {
            pageType: 'add',
        },
    });
}
const handleEdit = (id) => {
    router.push({
        path: "/userInfo",
        query: {
            pageType: 'add',
            ID: id
        },
    });
}
const init = () => {
    SearchUsersApi();
};
init();
</script>
<style scoped></style>