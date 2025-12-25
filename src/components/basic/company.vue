<!-- 查看公司详情组件 -->
<template>
    <el-dialog title="公司详情" v-model="dialogVisible" width="38%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false" class="evaluate-dialog">
        <div style="width:100%;height: 18px;"></div>
        <el-form :model="form" label-width="120px">
            <el-row>
                <el-col :span="20">
                    <el-form-item label="编码">
                        <el-input v-model="form.UnitCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="名称(中文)">
                        <el-input v-model="form.UnitName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="名称(英文)">
                        <el-input v-model="form.Ext_I18n.UnitName_en"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="名称(日文)">
                        <el-input v-model="form.Ext_I18n.UnitName_jp"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="onSubmit">
                    <p>保 存</p>
                </el-button>
                <el-button class="button2" @click="handleClose('close')">关 闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import {
    ref,
    reactive,
    toRefs,
    watch,
    computed
} from "vue";
import { ElMessage } from "element-plus";
import { GetUnit, SaveUnit } from "@/api/common.js";
// 定义组件属性
const props = defineProps({
    visible: Boolean,
    unitID: {
        type: Number,
        default: null
    },
    unitType: {
        type: Number,
        default: 3
    }
});
// 从属性中解构
const { visible, unitID } = toRefs(props);
const btnLoading = ref(false);
const form = reactive({
    UnitID: 0,
    UnitCode: "",
    UnitName: "",
    UnitType: props.unitType,
    UnitLogo: "https://zytest15.oss-cn-shanghai.aliyuncs.com/DL/home_header.png",
    ParentUnitID: 2,
    Ext_I18n: {
        UnitName_en: "",
        UnitName_jp: "",
    }
})
const dialogVisible = ref(false);
const emit = defineEmits(["closeVisible"]);
const onSubmit = async () => {
    btnLoading.value = true;
    const res = await SaveUnit({
        Unit: form
    });
    btnLoading.value = false;
    if (res.Code == 200) {
        ElMessage.success("保存成功");
        handleClose('save');
    } else {
        ElMessage.error(res.Message);
    }

};
const handleClose = (type) => {
    emit("closeVisible", type);
};
const GetUnitApi = async (ID) => {
    try {
        const response = await GetUnit({ UnitId: ID });
        if (response.Code == 200) {
            Object.assign(form, response.DataMap);
        }
    } catch (error) {
        console.error("Error fetching unit data:", error);
    }
};
// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (props.unitID == 0) {
            //新增
            form.UnitID = 0;
            form.UnitCode = "";
            form.UnitName = "";
            form.ParentUnitID = 2;
            form.UnitType = props.unitType;
            form.Ext_I18n.UnitName_en = "";
            form.Ext_I18n.UnitName_jp = "";
        }
        if (newValue && props.unitID != 0) {
            GetUnitApi(props.unitID)
        }
    }
);
</script>
