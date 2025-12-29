<!-- 考试详情 -->
<template>
    <div>
        <breadcrumb-component :title="'考试'" :subTitle="'详情'" urlPath="/test"></breadcrumb-component>
        <div class="container">
            <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item prop="ExamTitle" label="标题（中文）">
                            <el-input v-model="form.ExamTitle" :disabled="pageType == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="ExamTitle" label="标题（日文）">
                            <el-input v-model="form.Ext_I18n.ExamTitle_jp" :disabled="pageType == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="描述">
                            <el-input v-model="form.ExamDesc" :disabled="pageType == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item prop="BeginTime" label="开始时间">
                            <el-date-picker style="width:100%" v-model="form.BeginTime" type="datetime"
                                placeholder="选择日期时间" format="YYYY-MM-DD HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="EndTime" label="结束时间">
                            <el-date-picker style="width:100%" v-model="form.EndTime" type="datetime"
                                placeholder="选择日期时间" format="YYYY-MM-DD HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.ExamType == 0">
                    <el-col :span="10">
                        <el-form-item label="读完培训资料">
                            <el-switch v-model="form.jsonConfig.NeedReadTrainingResponse"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="读完其中一件资料">
                            <el-switch v-model="form.jsonConfig.OnlyReadOneTrainingResponse"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="form.ExamType == 0">
                    <el-col :span="6">
                        <el-form-item label="需完成的资料">
                            <el-select v-model="form.jsonConfig.TrainingResponseType"
                                @change="changeTrainingResponseType" filterable clearable placeholder="请选择学习内容"
                                style="width:100%">
                                <el-option label="学习资料" value="1">
                                </el-option>
                                <el-option label="视频内容" value="2">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="" label-width="10px">
                            <div style="display: flex;">
                                <el-button plain type="primary" @click="addMaterial">添加素材</el-button>
                                <el-popover placement="top-start" trigger="click">
                                    <template #reference>
                                        <p style="padding-left: 6px;cursor: pointer;">{{ selMaterialItemsDesc }}</p>
                                    </template>
                                    <template #default>
                                        <div v-for="(item, index) in form.Ext_Responses" :key="index">
                                            {{ item.title }}
                                        </div>
                                    </template>
                                </el-popover>
                            </div>

                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="">
                            <el-button plain type="primary" @click="addQuestion">添加考试</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="">
                            <!-- 题目详情列表展示 -->
                            <exam-list-component :examItems="form.Ext_ExamItems" :questionType="questionType"
                                :pageType="pageType" @selItemExamBtn="selItemExamBtn"></exam-list-component>
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
        <!-- 题目详情弹窗 -->
        <exam-component :visible="examVisible" :questionType="questionType" :examItem="examItem"
            :ExamType="form.ExamType" @closeVisible="closeVisible"></exam-component>

        <!-- 选择素材弹窗 -->
        <material-component :visible="materialMaterial" @closeVisible="closeVisibleMaterial"></material-component>
    </div>
</template>
<script setup>
import breadcrumbComponent from "@/components/common/breadcrumb.vue";
import examComponent from "@/components/basic/modal/exam.vue";
import materialComponent from "@/components/basic/modal/material.vue";
import examListComponent from "@/components/basic/examList.vue";
import { ref, reactive } from "vue";
import { GetExam, SaveExam } from "@/api/common.js";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();
const pageType = ref("");//页面类型：view查看，edit编辑，add新增
const questionType = ref("exam");
const btnLoading = ref(false);
const formRef = ref(null);
const examVisible = ref(false);
const examItem = ref({});//用于编辑弹窗显示
const materialMaterial = ref(false);//添加素材弹窗
const selMaterialItemsDesc = ref("");//选中的素材数据
const rules = {
    ExamTitle: [
        { required: true, message: "请输入标题", trigger: "blur" },
    ],
    BeginTime: [
        { required: true, message: "请选择开始时间", trigger: "blur" },
    ],
    EndTime: [
        { required: true, message: "请选择结束时间", trigger: "blur" },
    ],

};

const form = reactive({
    ExamID: 0,
    ExamType: 1,//类型(0:考卷;1:问卷调查)
    BeginTime: "",
    EndTime: "",
    Ext_ExamItems: [],
    Ext_I18n: {},
    ExamConfig: "",
    Ext_Responses: [],
    jsonConfig: {
        TrainingResponseType: "",//1 pdf,2 视频
        OnlyReadOneTrainingResponse: false,//是否只需要读完所有培训资料中的一件就可以
        NeedReadTrainingResponse: false,//是否需要读完培训资料
        PrivateExtConfig: "",//保存自定义json数据
    },
});
const GetExamApi = async (ID) => {
    const res = await GetExam({
        ExamId: ID,
        ReturnExamItems: true
    });
    if (res.Code == 200) {
        Object.assign(form, res.DataMap);
        form.EndTime = res.DataMap.Ext_EndTimeStr;
        form.BeginTime = res.DataMap.Ext_BeginTimeStr;
        form.jsonConfig = JSON.parse(res.DataMap.ExamConfig || "{}");
        if (res.DataMap.Ext_Responses.length > 0) {
            if (form.jsonConfig.TrainingResponseType == '1') {
                selMaterialItemsDesc.value = "您当前选择了" + res.DataMap.Ext_Responses.length + "个pdf素材";
            } else {
                selMaterialItemsDesc.value = "您当前选择了" + res.DataMap.Ext_Responses.length + "个视频素材";
            }
        }
    }
}
//选中的一个题目详情
const selItemExamBtn = (val) => {
    if (val.opType == 'edit') {
        Object.assign(examItem.value, form.Ext_ExamItems[val.index]);
        examVisible.value = true;
    }
    if (val.opType == 'del') {
        //删除当前模块
        const index = form.Ext_ExamItems.findIndex(item => item.ExamItemID === val.opTyExamItemID);
        if (index !== -1) {
            form.Ext_ExamItems.splice(index, 1);
        }
    }
}
//关闭内容弹窗
const closeVisible = (val) => {
    if (val != 'close') {
        if (val.ExamItemID) {
            const idx = form.Ext_ExamItems.findIndex(item => item.ExamItemID === val.ExamItemID);
            if (idx !== -1) {
                form.Ext_ExamItems.splice(idx, 1, { ...form.Ext_ExamItems[idx], ...val });
            }
        } else {
            form.Ext_ExamItems.push(val);
        }
    }
    examVisible.value = false;

}
// 表单校验
const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            btnLoading.value = true;
            form.ExamConfig=JSON.stringify(form.jsonConfig)
            let res = await SaveExam({ Exam: form });
            btnLoading.value = false;
            if (res.Code == 200) {
                ElMessage.success("保存成功");
                setTimeout(function () {
                    router.push({
                        path: "/test",
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
//新增考试的时候需要清空数据
const addQuestion = () => {
    examItem.value = {};
    examVisible.value = true
}
//切换培训自考类型的时候，需要清空数据
const changeTrainingResponseType = (val) => {
    selMaterialItemsDesc.value = "";
    form.Ext_Responses = [];
}
const addMaterial = () => {
    materialMaterial.value = true;
}
const closeVisibleMaterial = (val) => {
    console.log(val)
    // 合并并去重选中的素材
    const incoming = Array.isArray(val?.data) ? val.data : [];
    const seen = new Set();
    const merged = [...form.Ext_Responses, ...incoming].filter((item) => {
        const key = item.ResponseID;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    form.Ext_Responses = merged;
    if (form.jsonConfig.TrainingResponseType == '1') {
        selMaterialItemsDesc.value = "您当前选择了" + form.Ext_Responses.length + "个pdf素材";
    } else {
        selMaterialItemsDesc.value = "您当前选择了" + form.Ext_Responses.length + "个视频素材";
    }
    materialMaterial.value = false;
}
const onReturn = () => {
    router.go(-1);
}

const init = () => {
    form.ExamID = router.currentRoute.value.query.ID
        ? router.currentRoute.value.query.ID
        : 0;
    pageType.value = router.currentRoute.value.query.pageType;


    if (form.ExamID) {
        GetExamApi(form.ExamID);
    }
}
init()
</script>
<style scoped></style>