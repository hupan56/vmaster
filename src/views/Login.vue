<!--  -->
<template>
    <div class="login_container">

        <span style="color: red">登录组件1</span>
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!-- 登陆表单区域 -->
            <el-form ref="loginFormRef" label-width="0px" :rules="loginFromRules" :model="loginForm" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont hpicon-ren"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont hpicon-suo" show-password></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            //登录表单验证规则
            loginFromRules: {
                // 验证用户名是否合法
                username: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入登陆密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            },
            //登录表单
            loginForm: {
                username: "admin",
                password: "123456"
            }
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        login() {
            //预验证
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) return;
                const { data: refs } = await this.$http.post("login", this.loginForm);
                if (refs.meta.status !== 200) {
                    //登陆失败
                    this.$message({
                        message: `${refs.meta.msg}`,
                        type: 'error'
                    });
                }
                else {
                    //登陆成功
                    this.$message.success(`${refs.meta.msg}`);
                    //保存token
                    window.sessionStorage.setItem("token", refs.data.token); 
                    console.log(refs.data.token)
                    //导航跳转到主页
                    this.$router.push("/home")
                    // console.log(this)
                }
            })
        },
        resetLoginForm() {
            
            this.$refs.loginFormRef.resetFields();
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>


<style lang="less" scoped>
/* @import url(); 引入公共css类 */
.login_container {
    background-color: #2b4b6b;
    height: 100vh;

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avatar_box {
            height: 100px;
            width: 100px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            // 横,纵
            transform: translate(-50%, -50%);

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: rgb(33, 164, 194)
            }
        }
    }

}

.btns {
    display: flex;
    justify-content: flex-end;

}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}
</style>