<!-- 权限 -->
<template>
    <div>
        <breadcrumb-component :title="'权限'" urlPath="/right"></breadcrumb-component>
        <div class="container">
            <div class="search">
                <el-row>
                    <el-col :span="1">
                        <el-button type="primary">
                            <el-icon style="vertical-align: middle">
                                <Plus />
                            </el-icon>
                            <span style="vertical-align: middle">新增</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6" :offset="1">
                    </el-col>
                </el-row>
            </div>
            <div style="width:100%;height: 10px;"></div>
            <el-row>
                <el-col :span='3'>
                    <el-tree style="max-width: 600px" :data="appItems" :props="defaultProps"
                        @node-click="handleNodeClick" />
                </el-col>
                <el-col :span='20' :offset="1">
                    <el-table :data="appTableData" border style="width: 100%"
                        :header-cell-style="{ 'text-align': 'center' }" header-cell-class-name="table-header">
                        <el-table-column align="center" prop="RightCode" label="编码" width="180" />
                        <el-table-column align="center" label="名称">
                            <template #default="scope">
                                <el-button type="primary" size="small" text @click="handleView(scope.row.RightID)">{{
                                    scope.row.RightName }}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="DisplayIndex" label="顺序" />
                        <el-table-column align="center" label="操作" width="160">
                            <template #default="scope">
                                <el-button size="small" type="primary" text @click="handleEdit(scope.row.RightID)">编辑
                                </el-button>
                            </template></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script setup>
import breadcrumbComponent from "@/components/common/breadcrumb.vue";
import { Search,Plus } from '@element-plus/icons-vue'
import { ref, reactive } from "vue";
import { GetAppList, GetSubRightList } from "@/api/common.js";
import { useRouter } from "vue-router";
const router = useRouter();
const appItems = ref([]);
const handleNodeClick = (menuData) => {
    if (menuData.RightID && menuData.Ext_SubRights && menuData.Ext_SubRights.length > 0) {
        GetSubRightListApi(menuData.RightID);
    }
};
const defaultProps = {
    children: 'Ext_SubRights',
    label: 'RightName',
}
const GetAppListApi = async () => {
    const res = await GetAppList({
        OnlyValid: true,
        ReturnRight: true,
        CascadeRight: true
    })
    if (res.Code == 200) {
        for (let i = 0; i < res.DataMap.length; i++) {
            const element = res.DataMap[i];
            element.RightName = element.AppName;
            if (element.Ext_Rights.length > 0) {
                element.Ext_SubRights = element.Ext_Rights;
            }
        }
        appItems.value = res.DataMap;
    }
}
const appTableData = ref([]);
const GetSubRightListApi = async (ID) => {
    const res = await GetSubRightList({
        RightId: ID,
    })
    if (res.Code == 200) {
        appTableData.value = res.DataMap;
    }
}
const handleEdit = (id) => {
    router.push({
        path: "/rightInfo",
        query: {
            pageType: 'edit',
            ID: id,
        },
    });
}
const handleView = (id) => {
    router.push({
        path: "/rightInfo",
        query: {
            pageType: 'view',
            ID: id,
        },
    });
}

const init = () => {
    GetAppListApi()
}
init()
</script>
<style scoped></style>