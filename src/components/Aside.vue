<!--  -->
<template>
    <!-- 侧边栏菜单区域 -->
    <el-menu background-color="#545c64" text-color="#fff" active-text-color="#de8b12" :unique-opened="true" 
    :collapse="AsideIsCollapse" :collapse-transition="false" router :default-active="activePath"
    @select="saveNavState"
    ref="homeMenu"
    >
       
        <!--  一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模拟区域 -->
            <template slot="title">
                <!-- 图标 -->
                <i :class="iconObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+child.path" v-for="child in item.children" :key="child.id">

                <!-- 图标 -->
                <i class="iconfont hpicon-a-gengduocaidangongneng"></i>
                <!-- 文本 -->
                <span>{{ child.authName }}</span>
            </el-menu-item>
        </el-submenu>

    </el-menu>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    //import引入的组件需要注入到对象中才能使用
    names: "aside",
    components: {},
    data() {
        //这里存放数据
        return {
            menulist: [],
            iconObj: {
                '125': 'iconfont hpicon-mans'
                , '103': 'iconfont hpicon-icon-quanxian'
                , '101': 'iconfont hpicon-goodsmanagement'
                , '102': 'iconfont hpicon-dingdan'
                , '145': 'iconfont hpicon-shujutongji'
            },
            //被激活的链接地址
            activePath:""
        };
    },
    props: {AsideIsCollapse:Boolean},
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        async getMenuList() {
            const { data: res } = await this.$http.get("menus")
            if (res.meta.status !== 200) return this.$message.success(res.meta.msg)
            else {
                this.menulist = res.data
            }
            // console.log(res)
        },
        // menu自带的select事件会带有一个path值和indexPath数组
        saveNavState(index,indexPath){
            // console.log(index,indexPath)
            this.activePath=index
        }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.getMenuList();
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
<style scoped>
.hpicon-a-gengduocaidangongneng {
    font-size: 16px;
}

.el-menu {
    border-right: none;
}

/* @import url(); 引入公共css类 */
</style>