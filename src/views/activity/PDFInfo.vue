<!-- 学习资料编辑 -->
<template>
    <div>
        <breadcrumb-component :title="'学习资料'" :subTitle="'详情'" urlPath="/PDF"></breadcrumb-component>
        <div class="container">
            <el-form ref="formRef" :rules="rules" :model="form" label-width="160px">
                <el-row>
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="20">
                                <el-form-item prop="FileTitle" label="标题">
                                    <el-input v-model="form.FileTitle" :disabled="pageType == 'view'"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item prop="FileDesc" label="描述">
                                    <el-input v-model="form.FileDesc" :disabled="pageType == 'view'"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="语言分类">
                                    <el-select style="width:100%" clearable v-model="form.Ext_Response.ResponseClassify"
                                        placeholder="请选择">
                                        <el-option v-for="item in selectEn" :key="item.DictionaryDetailCode"
                                            :label="item.DictionaryDetailName" :value="item.DictionaryDetailCode">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="文件" ref="uploadElement" prop="">
                                    <el-upload class="upload-demo" action="#" :http-request="SuccessImg" :limit="1"
                                        :file-list="fileList">
                                        <el-button type="primary">点击上传</el-button>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-col>
                    <el-col :span="12">
                        <el-row v-if="form.Ext_FileImages.length > 0">
                            <el-col :span="24">
                                <el-form-item label="图片预览">
                                    <el-image v-for="(item, index) in form.Ext_FileImages" :key="index"
                                        :src="item.ImgUrl" style="width: 180px; height: 200px"
                                        :preview-src-list="imgViews">
                                    </el-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
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
import { GetFileResponse, SaveFileResponse, GetDictionaryDetailList } from "@/api/common.js";
import { UploadSingleToImage } from "@/api/imgApi.js";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();
const pageType = ref("");//页面类型：view查看，edit编辑，add新增
const selectEn = ref("");
const fileList = ref([]);
const imgViews = ref([]);
const btnLoading = ref(false);
const formRef = ref(null);
const rules = {
    FileTitle: [
        { required: true, message: "请输入标题", trigger: "blur" },
    ],
    FileDesc: [
        { required: true, message: "请输入描述", trigger: "blur" },
    ],
};
const form = reactive({
    ResponseID: 0,
    FileTitle: "", //标题
    FileDesc: "", //描述
    FileUrl: "", //URL
    ConvertToImg: 1,
    Ext_FileImages: [],
    Ext_Response: {
        ResponseClassify: ""
    }
});
const ImageUrls = ref([]);//预览图片
const GetFileResponseApi = async (ID) => {
    const res = await GetFileResponse({
        ResponseID: ID,
    });
    if (res.Code == 200) {
        Object.assign(form, res.DataMap);
        imgViews.value = res.DataMap.Ext_FileImages.map(item => item.ImgUrl);
        fileList.value = [
            { name: res.DataMap.FileTitle, url: res.DataMap.FileUrl }
        ];
    }
}
// 表单校验
const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            btnLoading.value = true;
            ImageUrls.value = form.Ext_FileImages.map(item => item.ImgUrl);
            ImageUrls.value = ImageUrls.value.join(";")
            let res = await SaveFileResponse({
                File: form,
                ImageUrls: ImageUrls.value
            });
            btnLoading.value = false;
            if (res.Code == 200) {
                ElMessage.success("保存成功");
                setTimeout(function () {
                    router.push({
                        path: "/PDF",
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
    const obj = {
        name: param.file.name
    };
    const res = await UploadSingleToImage(fd)
    if (res.Code == 200) {
        console.log(res.DataMap.ImageUrls)
        if (res.DataMap.ImageUrls.length > 0) {
            form.Ext_FileImages = [];
            res.DataMap.ImageUrls.forEach(element => {
                form.Ext_FileImages.push({
                    ImgUrl: element
                });
            });
        }
    } else {
        ElMessage.error(res.Message);
    }
};
const GetDictionaryDetailListApi = async () => {
    const { Code, DataMap } = await GetDictionaryDetailList({
        DictionaryCode: "wx-response-classify",
        OnlyValid: true
    })
    if (Code == 200) {
        selectEn.value = DataMap;
    }
}
const init = () => {
    form.ResponseID = router.currentRoute.value.query.ID
        ? router.currentRoute.value.query.ID
        : 0;
    pageType.value = router.currentRoute.value.query.pageType

    if (form.ResponseID) {
        GetFileResponseApi(form.ResponseID);
    }
    GetDictionaryDetailListApi()
}
init()
</script>
<style>
.upload-demo .el-upload--text {
    width: auto;
    height: auto;
    border: none;
}
</style>