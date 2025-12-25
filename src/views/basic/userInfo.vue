<!-- 修改用户详情 -->
<template>
    <div>
        <breadcrumb-component :title="'用户'" :subTitle="'用户'" urlPath="/userInfo"></breadcrumb-component>
        <!-- 主体信息 -->
        <div class="container">
            <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item prop="UserAccount" label="账号">
                            <el-input v-model="form.UserAccount" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item prop="UserName" label="姓名">
                            <el-input v-model="form.UserName" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="工号">
                            <el-input v-model="form.StaffNo" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="密码">
                            <el-input v-model="form.UserPassword" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="角色机构">
                            <el-button type="primary" @click="addRoleUser">添加角色</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.Ext_UserRoles.length > 0">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="">
                                <div v-for="role in form.Ext_UserRoles" :key="role.RoleID" style="margin-bottom: 5px;">
                                    <el-tag size="large" closable @close="() => handleClose(role)">{{
                                        role.Ext_Role.RoleName + '--' + role.Ext_Unit.UnitName }}</el-tag>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-row>
                <el-form-item>
                    <el-button v-if="pageType != 'view'" type="primary" :loading="btnLoading" @click="onSubmit">
                        保&nbsp;&nbsp;存
                    </el-button>
                    <el-button @click="onReturn">返&nbsp;&nbsp;回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import breadcrumbComponent from "@/components/common/breadcrumb.vue";
import md5 from "js-md5";
import { useRouter } from "vue-router";
const formRef = ref(null);
const router = useRouter();
import { ElMessage } from "element-plus";

import { GetUser, SaveUser, SearchRoles, GetUnitList } from "@/api/common.js";
const rules = {
    UserAccount: [
        { required: true, message: "请输入编码", trigger: "blur" },
    ],
    UserName: [
        { required: true, message: "请输入名称", trigger: "blur" },
    ],
}
const pageType = ref("");//页面类型：view查看，edit编辑，add新增
const btnLoading = ref(false);
const form = reactive({
    UserID: 0,
    UserAccount: "", //账号
    UserName: "", //姓名
    StaffNo: "", //工号
    UserPassword: "", //密码
    UserStatus: 1, //状态(1:正常,0:停用)
    UserType: 0, //类型（0:通用;1:系统保留）
    UserAlias: "", //别名
    UserHeadimgUrl:
        "https://zytest15.oss-cn-shanghai.aliyuncs.com/DL/home_header.png", //头像
    Ext_UserRoles: [],
})
const addRoleUser = () => {
}
const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            btnLoading.value = true;
            //提交表单
            setTimeout(() => {
                btnLoading.value = false;
                ElMessage.success("保存成功！");
                router.go(-1);
            }, 1000);
        } else {
            return false;
        }
    });
}
const onReturn = () => {
    router.go(-1);
}
const GetUserApi = async (ID) => {
    const res = await GetUser({
        UserId: ID,
        ReturnRole: true
    });
    if (res.Code == 200) {
        Object.assign(form, res.DataMap);
    }
}
// 删除角色关系（移除标签 + 同步字符串，若有对象数组则一并移除）
const handleClose = (tag) => {
    form.Ext_UserRoles = form.Ext_UserRoles.filter(
        (item) => item.RoleID !== tag.RoleID
    );
}
const init = () => {
    form.UserID = router.currentRoute.value.query.ID
        ? router.currentRoute.value.query.ID
        : 0;
    pageType.value = router.currentRoute.value.query.pageType

    if (form.UserID) {
        GetUserApi(form.UserID);
    }
}
init()
</script>
<style scoped></style>