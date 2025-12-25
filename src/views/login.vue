<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>

            <el-form :model="ruleForm" :rules="rules" ref="loginForm" label-width="0px" class="ms-content">
                <el-form-item prop="account">
                    <el-input v-model="ruleForm.account" placeholder="请输入账号">
                    </el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"
                        @keyup.enter.native="submitForm()">
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input placeholder="请输入验证码" v-model="ruleForm.code" @keyup.enter.native="submitForm()">
                    </el-input>
                    <div class="login-code" style="height: 30px;position: absolute;right: 0;top: 0;"
                        @click="refreshCode">
                        <Identify :identifyCode="identifyCode"></Identify>
                    </div>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" :loading="btnLoading" @click="submitForm()">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>
<script setup>
import Cookie from "js-cookie";
import Identify from "@/components/common/identify.vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { login, GetMyMenuList } from "@/api/common.js";
const router = useRouter();
import md5 from "js-md5";
import { ref, reactive } from "vue";
import { useMenuStore } from '@/stores/menu'
const menuStore = useMenuStore()
const ruleForm = reactive({
    account: "",
    code: "",
    password: "",
});
const loginForm = ref(null);
const btnLoading = ref(false);

const rules = {
    account: [
        {
            required: true,
            message: "请输入账号",
            trigger: "blur",
        },
    ],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};
const identifyCode = ref("");
const identifyCodes = ref("123456789abcdefjhjknpqrsduvwxyz");
const refreshCode = () => {
    identifyCode.value = "";
    makeCode(identifyCodes.value, 4);
}
const makeCode = (o, l) => {
    for (let i = 0; i < l; i++) {
        identifyCode.value += identifyCodes.value[
            randomNum(0, identifyCodes.value.length)
        ];
    }
}
const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}
const submitForm = () => {
    loginForm.value.validate(async (valid) => {
        if (valid) {
            btnLoading.value = true;
            if (ruleForm.code.toLowerCase() !== identifyCode.value.toLowerCase()) {
                ElMessage.error("请填写正确验证码");
                btnLoading.value = false;
                refreshCode();
                return;
            }
            const res = await login({
                Account: ruleForm.account,
                Pwd: md5(ruleForm.password),
                AppCode: "pcweb-e-dl"
            });
            btnLoading.value = false;
            if (res.Code == 200) {
                Cookie.set("User", JSON.stringify(res.DataMap.User));
                Cookie.set("CookieToken", res.DataMap.Token);
                ElMessage.success("登录成功");
                let response = await GetMyMenuList({ CascadeMenu: false });
                // 保存菜单到 Pinia 与本地缓存
                menuStore.setMenu(response.DataMap || [])

                if (response.Code == 200) {
                    var pathUrl = "";
                    for (var i = 0; i < response.DataMap.length; i++) {
                        if (
                            response.DataMap[i].UrlPath == "" ||
                            response.DataMap[i].UrlPath == undefined
                        ) {
                            continue;
                        }
                        if (pathUrl == "") {
                            pathUrl = response.DataMap[i].UrlPath;
                        }
                    }
                    router.push("/" + pathUrl);
                }
            } else {
                ElMessage.error(res.Message);
                return false;
            }
        } else {
            return false;
        }
    });
};
makeCode(identifyCodes.value, 4);
</script>
<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('https://zytest15.oss-cn-shanghai.aliyuncs.com/DL/login-bg.jpg');
    background-size: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}

.ms-login {
    position: absolute;

    width: 350px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

.ms-content {
    padding: 30px 30px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>