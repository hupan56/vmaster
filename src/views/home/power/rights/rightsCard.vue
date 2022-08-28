<!--  -->
<template>
    <div>
        <!-- 角色列表区域 -->
        <el-table :data="rightsList" style="width: 100%" :border="true" :stripe="true">
            
            <!-- 索引列 -->
            <el-table-column type="index" width="50% " label="#">
            </el-table-column>
            <el-table-column prop="authName" label="权限名称" sortable width="180" column-key="authName">
            </el-table-column>
            <el-table-column prop="path" label="路径" sortable width="180" column-key="path">
            </el-table-column>
            <el-table-column label="权限等级" prop="level" sortable width="180" column-key="level">
                <template slot-scope="scope">
                    <el-tag :type="rightsLevel[scope.row.level].type">{{ rightsLevel[scope.row.level].info }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
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
            // 权限列表
            rightsList: [],
            // 权限等级
            rightsLevel: [
                {
                    level: "1",
                    type: "danger",
                    info: "一级"
                },
                {
                    level: "2",
                    type: "warning",
                    info: "二级"
                },
                {
                    level: "3",
                    type: "success",
                    info: "三级"
                },
            ]


        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        // 获得所有权限列表
        async getRightsList() {
            const { data: res } = await this.$http.get("rights/list")
            if (res.meta.status !== 200) {
                return this.$message.error("获取权限列表失败")
            } else {
                this.rightsList = res.data
            }
            console.log(this.rightsList)
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        // 获得所有权限列表
        this.getRightsList();
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
/* @import url(); 引入公共css类 */
</style>