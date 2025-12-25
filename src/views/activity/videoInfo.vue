<!-- 视频编辑 -->
<template>
    <div>
        <breadcrumb-component :title="'视频'" :subTitle="'视频详情'" urlPath="/video"></breadcrumb-component>
        <div class="container">
            <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="VideoTitle" label="标题">
                            <el-input v-model="form.VideoTitle" :disabled="pageType == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="描述">
                            <el-input v-model="form.VideoDesc" :disabled="pageType == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="视频地址">
                            <el-input v-model="form.VideoUrl" :disabled="pageType == 'view'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="缩略图" ref="uploadElement" prop="">
                            <el-row>
                                <el-col :span="24">
                                    <el-upload class="brand-uploader" ref="upload" :show-file-list="false" action="#"
                                        :http-request="SuccessImg" :auto-upload="true">
                                        <img v-if="form.ThumbUrl" :src="form.ThumbUrl" style="width:100%"
                                            fit="contain" />
                                        <el-icon v-else>
                                            <Plus />
                                        </el-icon>
                                    </el-upload>
                                    <p class="text">图片，300*400 且不超过1M
                                        <span style="cursor: pointer;color: #ff6666 ;" class="el-icon-delete"
                                            v-if="form.ListImg" @click="clear">删除</span>
                                    </p>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="视频上传" prop="Video">
                            <!-- action必选参数, 上传的地址 -->
                            <video :src="form.VideoUrl" style="width:100%" controls="controls">
                                您的浏览器不支持视频播放
                            </video>
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
import { Plus } from '@element-plus/icons-vue'
import { GetVideoResponse, SaveVideoResponse } from "@/api/common.js";
import { UploadSingle } from "@/api/imgApi.js";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();
const pageType = ref("");//页面类型：view查看，edit编辑，add新增
const parentRightName = ref("");
const btnLoading = ref(false);
const formRef = ref(null);
const rules = {
    VideoTitle: [
        { required: true, message: "请输入标题", trigger: "blur" },
    ],
};
const form = reactive({
    ResponseID: 0,
    VideoTitle: "",
    VideoDesc: "",
    VideoUrl: "", //Url
    ThumbUrl: "", //缩略图URL
    Ext_Response: {}
});
const GetVideoResponseApi = async (ID) => {
    const res = await GetVideoResponse({
        ResponseID: ID,
    });
    if (res.Code == 200) {
        Object.assign(form, res.DataMap);
    }
}
// 表单校验
const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            btnLoading.value = true;
            let res = await SaveVideoResponse({ Video: form });
            btnLoading.value = false;
            if (res.Code == 200) {
                ElMessage.success("保存成功");
                setTimeout(function () {
                    router.push({
                        path: "/video",
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

const SuccessImg = async (param) => {
    let fd = new FormData();
    fd.append("file", param.file); //传文件
    const res = await UploadSingle(fd)
    if (res.Code == 200) {
        form.ThumbUrl = res.DataMap.HttpsUrl
    } else {
        ElMessage.error(res.Message);
    }
};
const init = () => {
    form.ResponseID = router.currentRoute.value.query.ID
        ? router.currentRoute.value.query.ID
        : 0;
    pageType.value = router.currentRoute.value.query.pageType

    if (form.ResponseID) {
        GetVideoResponseApi(form.ResponseID);
    }
}
init()
</script>
<style scoped></style>