<!--  -->
<template>

    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../../assets/heima.png" alt="电商管理系统">
                <span>电商管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主题区域-->
        <el-container>

            <!--  侧边栏 -->
            <el-aside :width="isCollapse==false?'200px':'64px'">
                <!-- 折叠展开 -->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <Aside :AsideIsCollapse="isCollapse"></Aside>
            </el-aside>
            <!-- 右侧内容主题 -->
            <el-main>
                <!-- 主题区域设为路由页面 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>


</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import Aside from "../../components/Aside.vue"
export default {
    name: "Home",
    //import引入的组件需要注入到对象中才能使用
    components: { Aside },
    data() {
        //这里存放数据
        return {
            isCollapse:false,
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.replace("/login")
        },
        // 点击按钮，菜单的折叠展开
        toggleCollapse(){
            this.isCollapse=!this.isCollapse
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
.home-container {
    height: 100vh;
}

.el-header {
    background-color: #363d40;
    display: flex;
    justify-content: space-between;
    padding-left: 0%;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background: #313743;
    overflow: hidden;
}

.el-main {
    background-color: #e9edf1;
}
.toggle-button{
    background-color: #465263;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
/* @import url(); 引入公共css类 */
</style>