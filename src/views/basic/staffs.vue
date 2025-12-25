<!-- 员工页面 -->
<template>
    <div>
        <breadcrumb-component :title="'员工'" urlPath="/staffs"></breadcrumb-component>
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
                        <el-button type="primary" @click="handleOut">
                            <el-icon style="vertical-align: middle">
                                <DocumentAdd />
                            </el-icon>
                            <span style="vertical-align: middle">导出</span>
                        </el-button>
                        <el-input style="width:30%;padding-left: 10px;" placeholder="请输入关键字查询"
                            v-model="SearchCondition.staff_keyword" clearable />
                    </el-col>
                </el-row>
            </div>
            <div style="width:100%;height: 10px;"></div>
            <el-table :data="tableData" border style="width: 100%" :loading="loading"
                :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
                <el-table-column prop="StaffNo" align="center" label="工号" width="100"></el-table-column>
                <el-table-column prop="StaffName" align="center" label="姓名"></el-table-column>
                <el-table-column align="center" label="性别" width="100">
                    <template #default="scope">
                        <div v-if='scope.row.StaffGender == 1'>男</div>
                        <div v-if='scope.row.StaffGender == 2'>女</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="StaffPosition" align="center" label="职位"></el-table-column> -->
                <el-table-column prop="StaffMobile" align="center" label="手机" width="160"></el-table-column>
                <el-table-column prop="StaffEmail" align="center" label="邮箱" width="160"></el-table-column>
                <el-table-column align="center" label="所属公司/部门">
                    <template #default="scope">
                        <div>{{ scope.row.Ext_Unit.Ext_ParentUnit.UnitName + ' / ' + scope.row.Ext_Unit.UnitName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="Ext_BindWxxcxDesc" align="center" label="是否绑定" width="100"></el-table-column>
                <el-table-column prop="StaffStatus" align="center" label="状态" width="100">
                    <template #default="scope">
                        <div v-if='scope.row.StaffStatus == 0'>停用</div>
                        <div v-if='scope.row.StaffStatus == 1'>正常</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160">
                    <template #default="scope">
                        <el-button type="primary" text @click="handleDetail(scope.$index, scope.row)">考试详情</el-button>
                        <el-button size="small" type="primary" text @click="handleEdit(scope.row.UserID)">编辑</el-button>
                        <el-button v-if="scope.row.StaffStatus == 1" size="small" type="primary" text>停用</el-button>
                        <el-button v-if="scope.row.StaffStatus == 0" size="small" type="primary" text>启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script setup>
import breadcrumbComponent from "@/components/common/breadcrumb.vue";
import { Search, Plus,DocumentAdd } from '@element-plus/icons-vue'
import { ref, reactive } from "vue";
import { SearchStaffs } from "@/api/common.js";
import { useRouter } from "vue-router";
import { useStaffsExport } from "@/hooks/use-export.js";
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
    staff_keyword: "",
    get_bind_wxxcx: 1,
    return_staff_unit: 1,

});
// 初始化数据
const SearchUsersApi = async () => {
    if (loading.value) return;
    loading.value = true;
    const res = await SearchStaffs({
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
// ===== 导出功能 =====
// 使用导出Hook
const { handleExport } = useStaffsExport();
const handleOut = async () => {
    handleExport(SearchCondition, loading);
};
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