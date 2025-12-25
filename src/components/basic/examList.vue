<!-- 题目列表展示card -->
<template>
    <el-row>
        <el-col v-for="(item, index) in examItems" :key="index" :span="12">
            <div class="exam-list">
                <el-collapse>
                    <el-collapse-item :name="item.ExamItemID">
                        <template #title>
                            <!-- 改为弹性布局，去掉固定宽度 -->
                            <div class="exam-title-row">
                                <div class="exam-title">{{ item.ExamItemName }}</div>
                                <div class="exam-btn" v-if="pageType != 'view'">
                                    <el-button text size="small" type="primary"
                                        @click.stop="edit(item.ExamItemID, index)">编辑</el-button>
                                    <el-button text size="small" type="primary"
                                        @click.stop="del(item.ExamItemID)">删除</el-button>
                                </div>
                            </div>
                        </template>
                        <!-- 子项也建议用稳定 key -->
                        <div v-for="exItem in item.Ext_ExamItemAnswers" :key="exItem.AnswerID ?? exItem.AnswerName">
                            <p>
                                答案：{{ exItem.AnswerName }}
                                <el-icon v-if="questionType === 'exam' && exItem.IsCorrect == 1"><Select /></el-icon>
                            </p>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-col>
    </el-row>

</template>
<script setup>
import { Select } from '@element-plus/icons-vue'
import {
    ref,
    reactive,
    toRefs,
    watch,
    computed
} from "vue";
// 定义组件属性
const props = defineProps({
    visible: Boolean,
    questionType: {
        type: String,
        default: "",//form：问卷调查，exam：考试
    },
    pageType: {
        type: String,//页面类型
        default: ""
    },

    examItems: {
        type: Array,
        default: () => []
    },
});
// 从属性中解构
const { visible, examItems } = toRefs(props);

const dialogVisible = ref(false);
const emit = defineEmits(["closeVisible", 'selItemExamBtn']);

const edit = (ID, Idx) => {
    emit("selItemExamBtn", {
        opType: 'edit',
        index: Idx,
        opTyExamItemID: ID,
    });
}
const del = (ID) => {
    emit("selItemExamBtn", {
        opType: 'del',
        opTyExamItemID: ID,
    });
}

</script>
<style scoped>
.exam-list {
    padding: 10px;
    border: solid 1px #f0f0f0;
    margin-bottom: 12px;
    margin-right: 10px;
    min-width: 400px;
}

.exam-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 400px;
}

.exam-title {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.exam-btn {
    display: flex;
    gap: 8px;
}
</style>