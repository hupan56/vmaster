<!--  -->
<template>
    <div>
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="13">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" :clearable="true"
                        @clear="getUserList">
                        <el-button slot="append" icon="iconfont hpicon-biaoqiankuozhan_sousuo-354" @click="getUserList">
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary"><span class="insertUsersButton"
                            @click="addDialogVisible = true">添加用户</span>
                    </el-button>
                </el-col>
            </el-row>
            <!--  用户列表区域-->
            <el-table :data="usersInfo.users" style="width: 100%" :border="true" :stripe="true">
                <el-table-column type="index" width="50%" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名" width="180"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <main></main>
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
                            @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="small"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>

            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10, 20]" :page-size="queryInfo.pagesize"
                layout="total,sizes, prev, pager, next,jumper" :total="usersInfo.total">
            </el-pagination>
        </el-card>
        <!-- 添加用户提示框 -->
        <el-dialog title="提示" :visible.sync="addDialogVisible" width="30%">
            <!-- 内容主题区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="addForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input v-model="addForm.passWord"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消
                </el-button>
                <el-button type="primary" @click="addDialogVisible = false">确 定
                </el-button>
            </span>
        </el-dialog>
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
            // 获取用户列表的参数
            queryInfo: {
                query: "",
                // 当前的页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 2
            },
            usersInfo: {
                users: [],
                total: 0,
            },
            // 控制对话框的显示和隐藏
            addDialogVisible: false,
            // 添加用户表单数据
            addForm: {
                userName:"",
                passWord:"",
                email:"",
                mobile:""
            },
            addFormRules: {
                userName: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                passWord: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                 email: [
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                 mobile: [
                    { required: true, message: '请输入用户手机', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
            }
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get("users", { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            else {
                this.usersInfo = res.data
                console.log(this.usersInfo)
            }
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList();
        },
        // 监听页码值改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList();
        },
        //监听switch用户状态改变
        async userStateChange(userInfo) {
            console.log(userInfo)
            const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if (res.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error(res.meta.msg)
            }
            else {
                return this.$message.success(`修改${userInfo.username}用户状态成功`)
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.getUserList();
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
.insertUsersButton {
    color: #fff;
}

.el-pagination {}

/* @import url(); 引入公共css类 */
</style>