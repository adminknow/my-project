<!-- 题目详情弹窗 -->
<template>
    <el-dialog title="问卷内容" v-model="dialogVisible" width="52%" :show-close="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div style="width:100%;height: 18px;"></div>
        <el-form :model="form" :rules="rules" label-width="120px">
            <el-row>
                <el-col :span="21">
                    <el-form-item prop="ExamItemName" label="问题（中文）">
                        <el-input v-model="form.ExamItemName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="21">
                    <el-form-item prop="ExamNameJp" label="问题（日文）">
                        <el-input v-model="form.Ext_I18n.ExamItemName_jp" @input="inputExamNameJp"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="ExamType == 0">
                <el-col :span="21">
                    <el-form-item label="答案随机">
                        <el-radio-group v-model="form.ExamItemConfig.NoRandom">
                            <el-radio :label="1">不随机</el-radio>
                            <el-radio :label="0">随机</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="ExamType == 0">
                <el-col :span="21">
                    <el-form-item prop="ExamItemType" label="分数">
                        <el-input v-model="form.ExamItemPoint"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="ExamType == 1">
                <el-col :span="21">
                    <el-form-item prop="ExamItemType" label="类型">
                        <el-radio-group v-model="form.ExamItemType">
                            <el-radio label="1">单选</el-radio>
                            <el-radio label="2">多选</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='24'>
                    <el-form-item :label="'选项' + parseInt(index + 1)" v-for="(item, index) in form.Ext_ExamItemAnswers">
                        <div style="width: 100%;display: flex;">
                            <el-input :style="{ width: ExamType == 0 ? '80%' : '100%' }" clearable placeholder="请输入内容"
                                v-model="item.AnswerName">
                                <template #append>中文</template>
                            </el-input>
                            <div style="width: 20%" v-if="ExamType == 0">
                                <el-icon v-if="item.IsCorrect == 1"
                                    style=" margin:0 8px;color: green;"><Select /></el-icon>
                                <el-icon v-if="item.IsCorrect == 0" style=" margin:0 8px" @click="selRight(index)">
                                    <CloseBold />
                                </el-icon>
                                <el-icon style=" margin:0 8px" @click="del(index)">
                                    <Delete />
                                </el-icon>
                            </div>
                        </div>
                        <div style="width:100%;height: 6px;"></div>
                        <div style="width: 100%">
                            <el-input :style="{ width: ExamType == 0 ? '80%' : '100%' }" clearable
                                placeholder="内容を入力してください" v-model="item.Ext_I18n.AnswerName_jp">
                                <template #append>日文</template>
                            </el-input>
                        </div>
                        <div v-if="ExamType == 1">
                            <span>是否允许输入答案 </span>
                            <el-radio-group v-model="item.CanInputAnswer">
                                <el-radio label="1">必输</el-radio>
                                <el-radio label="2">可不输</el-radio>
                                <el-radio label="0">不输</el-radio>
                            </el-radio-group>
                        </div>
                        <div v-if="form.ExamItemType == 1 && ExamType == 1" style="margin-top: 4px;">
                            <span>跳转至</span>
                            <el-input style="width:10%" placeholder="" v-model="item.GoExamItemIndex">
                            </el-input>
                            <span>题</span>
                            <div style="color:#909399" v-if="form.ExamItemType == 1">
                                答完每一题之后会对应跳转到相应的题目(‘0’代表默认跳转下一题，<span style="color: #f56c6c;">‘-1’</span>代表答题结束)</div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="21">
                    <el-form-item>
                        <el-button @click="addFormAnswers">新增选项</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="21">
                    <el-form-item label="题目解释（中文）">
                        <el-input v-model="form.ExamItemExplain"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="21">
                    <el-form-item label="题目解释（日文）">
                        <el-input v-model="form.Ext_I18n.ExamItemExplain_jp"></el-input>
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
import { Select, Delete, CloseBold } from '@element-plus/icons-vue'
import { ElMessage } from "element-plus";
import { GetUnit, SaveUnit, SearchUnits } from "@/api/common.js";
// 定义组件属性
const props = defineProps({
    visible: Boolean,
    ExamID: {
        type: Number,
        default: null
    },
    examItem: {
        type: Object,
        default: () => ({})
    },
    ExamType: {
        type: Number,
        default: 1,//类型(0:考卷;1:问卷调查)
    }
});
// 从属性中解构
const { visible, ExamID } = toRefs(props);
const btnLoading = ref(false);
const form = reactive({
    ExamID: 0,
    ExamItemID: 0,
    ExamItemName: "",
    ExamNameJp: "",
    ExamNameEn: "",
    ExamItemType: "1",/// 题目类型(1:单选;2:多选;3:对错;4:问答;5:满意度)
    ExamItemSort: "",
    ExamItemPoint: "",//分数
    ExamItemExplain: "",//中文题目解释
    ExamItemConfig: {
        NoRandom: 0, //1：即使考试随机，此题目的答案也不随机;默认0：跟随整个考试随机
    },
    IsCorrect: 0,//对错题时，是否正确
    Ext_ExamItemAnswers: [{
        AnswerName: "",
        IsCorrect: 0,
        CanInputAnswer: 0,//是否允许输入答案  1、必输 2、可不输，0、不输           
        GoExamItemIndex: "",//选择本答案后跳转至哪一题目(-1表示考试结束)
        Ext_I18n: {
            AnswerName_en: "",
            AnswerName_jp: "",
        },
    }],
    Ext_I18n: {
        ExamItemName_en: "",
        ExamItemName_jp: "",
        ExamItemExplain_jp: "",//日文解释
    }
})
const rules = {};
const inputExamNameJp = (val) => {
    form.Ext_I18n.ExamItemName_jp = val;
}
const addFormAnswers = () => {
    form.Ext_ExamItemAnswers.push({
        AnswerName: "",
        IsCorrect: 0,
        CanInputAnswer: 0,//是否允许输入答案  1、必输 2、可不输，0、不输           
        GoExamItemIndex: "",//选择本答案后跳转至哪一题目(-1表示考试结束)
        Ext_I18n: {
            AnswerName_en: "",
            AnswerName_jp: "",
        },
    })
}
const dialogVisible = ref(false);
const emit = defineEmits(["closeVisible"]);
const onSubmit = async () => {
    // btnLoading.value = true;
    if (form.ExamItemName == "" || form.Ext_ExamItemAnswers.length <= 1) {
        ElMessage.error("请先完善数据");
        return;
    }
    form.ExamItemConfig = JSON.stringify(form.ExamItemConfig)
    handleClose(form);

};
//把其中一个选项变成正确答案，
const selRight = (idx) => {
    form.Ext_ExamItemAnswers.forEach(row => {
        row.IsCorrect = 0
    })
    form.Ext_ExamItemAnswers[idx].IsCorrect = 1;
}
const del = (idx) => {
    //删除选项
    if (form.Ext_ExamItemAnswers.length > 1) {
        form.Ext_ExamItemAnswers.splice(idx, 1)
    }
}
const handleClose = (type) => {
    emit("closeVisible", type);
};
// 监听弹窗显示状态;
watch(
    () => props.visible,
    (newValue) => {
        dialogVisible.value = newValue;
        if (newValue) {
            const hasExamItem = props.examItem && Object.keys(props.examItem).length > 0;
            if (hasExamItem) {
                Object.assign(form, JSON.parse(JSON.stringify(props.examItem)));
                if (form.ExamItemConfig == "") {
                    form.ExamItemConfig = {
                        NoRandom: 0
                    }
                } else {
                    form.ExamItemConfig = JSON.parse(form.ExamItemConfig)
                }
                return;
            }
            form.ExamID = 0;
            form.ExamItemID = 0;
            form.ExamItemName = "";
            form.ExamNameJp = "";
            form.ExamNameEn = "";
            form.ExamItemType = "1";
            form.ExamItemSort = "";
            form.ExamItemPoint = "";
            form.ExamItemExplain = "";
            form.ExamItemConfig = { NoRandom: 0 };
            form.IsCorrect = 0;
            form.Ext_ExamItemAnswers = [
                {
                    AnswerName: "",
                    IsCorrect: 0,
                    CanInputAnswer: 0,
                    GoExamItemIndex: "",
                    Ext_I18n: {
                        AnswerName_en: "",
                        AnswerName_jp: "",
                    },
                },
            ];
            form.Ext_I18n = {
                ExamItemName_en: "",
                ExamItemName_jp: "",
                ExamItemExplain_jp: "",
            };
        }
    }
);
</script>
