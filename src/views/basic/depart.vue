<!-- 部门页面 -->
<template>
    <div>
        <breadcrumb-component :title="pageObject.title"></breadcrumb-component>
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
                            v-model="SearchCondition.search_keyword" clearable />
                    </el-col>
                </el-row>
            </div>
            <div style="width:100%;height: 10px;"></div>
            <el-table :data="tableData" border style="width: 100%" :loading="loading"
                :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
                <el-table-column prop="UnitCode" align="center" label="编码"></el-table-column>
                <el-table-column align="center" label="名称(中文)">
                    <template #default="scope">
                        <p>{{ scope.row.UnitName }}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="名称（日文）">
                    <template #default="scope">
                        <p v-if="scope.row.Ext_I18n.UnitName_jp">{{ scope.row.Ext_I18n.UnitName_jp }}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属公司">
                    <template #default="scope">
                        <p>{{ scope.row.Ext_ParentUnit.UnitName }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="UnitStatus" align="center" label="状态">
                    <template #default="scope">
                        <div v-if='scope.row.UnitStatus == 1'>正常</div>
                        <div v-if='scope.row.UnitStatus == 0'>停用</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160">
                    <template #default="scope">
                        <el-button size="small" type="primary" text @click="handleEdit(scope.row.UnitID)">编辑</el-button>
                        <el-button v-if="scope.row.UserStatus == 1" size="small" type="primary" text>停用</el-button>
                        <el-button v-if="scope.row.UserStatus == 0" size="small" type="primary" text>启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 主表格分页 -->
            <pagination-component v-model:current-page="pagination.PageStartRow"
                v-model:page-size="pagination.PageRowCount" :total="pagination.pageTotal" :page-sizes="[15, 50, 100]"
                @page-change="handlePageChange" @size-change="handleSizeChange" />
        </div>

        <!-- 部门编辑与查看组件 -->
        <depart-component :unitID="unitID" :unitType="pageObject.selUnitType" :visible="companyVisible"
            @closeVisible="closeCompanyVisible" ref="departComponentRef" />
    </div>
</template>
<script setup>
import breadcrumbComponent from "@/components/common/breadcrumb.vue";
import paginationComponent from "@/components/table/pagination.vue";
import departComponent from "@/components/basic/depart.vue";
import { Search, Plus, DocumentAdd } from '@element-plus/icons-vue'
import { ref, reactive, watch } from "vue";
import { SearchUnits } from "@/api/common.js";
import { useDepartExport } from "@/hooks/use-export.js";
import { useRouter } from "vue-router";
const router = useRouter();
const pageObject = reactive({
    title: "",
    url: "",
    selUnitType: "",
});
//搜索条件
const SearchCondition = reactive({
    search_keyword: "",
    unit_type: 4,
    get_unit_i18n: 1,
});
const loading = ref(false);
const tableData = ref([]);
// 分页配置
const pagination = reactive({
    PageStartRow: 1,
    PageRowCount: 15,
    pageTotal: 0,
});
// 公司编辑与查看组件
const companyVisible = ref(false);
const unitID = ref(0);
//编辑
const handleEdit = (unitId) => {
    unitID.value = unitId;
    companyVisible.value = true;
};

const closeCompanyVisible = (type) => {
    companyVisible.value = false;
    if (type === 'save') {
        handleSearch();
    }
};
const SearchUnitsApi = async () => {
    loading.value = true;
    const { DataMap, Code } = await SearchUnits({
        SearchCondition: SearchCondition,
        PageStartRow: (pagination.PageStartRow - 1) * pagination.PageRowCount,
        PageRowCount: pagination.PageRowCount,
    })
    loading.value = false;
    if (Code == 200) {
        tableData.value = DataMap;
        if (DataMap.length > 0) {
            pagination.pageTotal = DataMap[0].DataCount;
        }
    }
}
// 分页导航
const handlePageChange = (val) => {
    pagination.PageStartRow = val;
    SearchUnitsApi();
};
const handleSizeChange = (val) => {
    pagination.PageRowCount = val;
    SearchUnitsApi();
};
const handleSearch = () => {
    pagination.PageStartRow = 1;
    SearchUnitsApi();
}
// ===== 导出功能 =====
// 使用导出Hook
const { handleExport } = useDepartExport();
const handleOut = async () => {
    handleExport(SearchCondition, loading);
};
const handleAdd = () => {
    unitID.value = 0;
    companyVisible.value = true;
}
const init = () => {
    pageObject.title = router.currentRoute.value.meta.title;
    SearchCondition.unit_type = router.currentRoute.value.meta.page;
    pageObject.selUnitType = router.currentRoute.value.meta.unitType;

    SearchUnitsApi()
}
init()
watch(
    () => router.currentRoute.value,
    (data) => {
        if (data.meta.title == "部门（调查问卷）" || data.meta.title == "部门") {
            pageObject.title = data.meta.title;
            SearchCondition.unit_type = data.meta.page;
            pageObject.selUnitType = data.meta.unitType;
            init()
        }

    }
);
</script>
<style scoped></style>