<!-- 权限 -->
<template>
    <div>
        <breadcrumb-component :title="'权限'" :subTitle="'权限详情'" urlPath="/right"></breadcrumb-component>
        <div class="container">
            <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="应用">
                            <el-input disabled maxlength="20" show-word-limit v-model="appName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="上级菜单">
                            <el-input disabled maxlength="20" show-word-limit v-model="parentRightName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="编码" prop="RightCode">
                            <el-input :disabled="pageType=='view'" maxlength="20" show-word-limit
                                v-model="form.RightCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="名称" prop="RightName">
                            <el-input :disabled="pageType=='view'" maxlength="20" show-word-limit
                                v-model="form.RightName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item prop="DisplayIndex" label="显示次序">
                            <el-input :disabled="pageType=='view'" v-model="form.DisplayIndex"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item prop="RightType" label="权限类型">
                            <el-radio-group v-model="form.RightType" :disabled="pageType=='view'">
                                <el-radio label="1">菜单</el-radio>
                                <el-radio label="2">操作</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item prop="UrlPath" label="访问路径">
                            <el-input v-model="form.UrlPath" :disabled="pageType=='view'"></el-input>
                        </el-form-item>
                    </el-col>
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
import breadcrumbComponent from "@/components/common/breadcrumb.vue";
import { ref, reactive } from "vue";
import { GetRight, SaveRight } from "@/api/common.js";
import { useRouter } from "vue-router";
const router = useRouter();
import { ElMessage } from "element-plus";

const pageType = ref("");//页面类型：view查看，edit编辑，add新增
const appName = ref("东丽合规后台管理系统");
const parentRightName = ref("");
const btnLoading=ref(false);
const formRef = ref(null);
const rules = {
    RightCode: [
        { required: true, message: "请输入编码", trigger: "blur" },
    ],
    RightName: [
        { required: true, message: "请输入名称", trigger: "blur" },
    ],
};
const form = reactive({
    AppID: 2,
    ParentRightID: 0,
    RightID: 0,
    RightCode: "", //编码
    RightName: "", //名称
    RightNameEn: "", //英文名称
    RightType: "1", //类型(1:菜单;2:操作)
    UrlPath: "", //访问路径
    IconPath: "", //图标路径
    DisplayIndex: "" //显示顺序
});
const GetRightApi = async (ID) => {
    const res = await GetRight({
        RightId: ID,
    });
    if (res.Code == 200) {
        form.RightType = String(res.DataMap.RightType);
        if (res.DataMap.ParentRightID != 0) {
            Object.assign(form, res.DataMap);
            //去拿上级权限名称
            GetRightApi(res.DataMap.ParentRightID);
        } else {
            parentRightName.value = res.DataMap.RightName;
        }
    }
}
// 表单校验
const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            btnLoading.value = true;
            let res = await SaveRight({ Right: form });
            btnLoading.value = false;
            if (res.Code == 200) {
                ElMessage.success("保存成功");
                setTimeout(function () {
                    router.push({
                        path: "/right",
                    });
                }, 2000);
            } else {
                ElMessage.error(res.Message);
            }
        } else {
            return false;
        }
    });
}
const onReturn = () => {
    router.go(-1);
};
const init = () => {
    form.RightID = router.currentRoute.value.query.ID
        ? router.currentRoute.value.query.ID
        : 0;
    pageType.value = router.currentRoute.value.query.pageType

    if (form.RightID) {
        GetRightApi(form.RightID);
    }
}
init()
</script>
<style scoped></style>