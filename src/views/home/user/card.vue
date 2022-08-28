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
                    <el-button type="primary" @click="changeAddDialogVisible">
                        添加用户
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
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="small"
                                @click="showEditDialog(scope.row)">
                            </el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="small"
                                @click="deleteUser(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="small" @click="setRole(scope.row)">
                            </el-button>
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
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
            <!-- 内容主题区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
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
                <el-button type="primary" @click="addUser">确 定
                </el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
            <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
            <div>
                <p>
                    当前用户：{{ userRoleInfo.username }}
                </p>
                <p>
                    当前用户的角色：{{ userRoleInfo.role_name }}
                </p>
                <!-- 角色下拉框 -->
                <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
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
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            //  验证邮箱规则的正则表达式
            const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error("请输入合法的邮箱"))
        }
        // 验证手机的规则
        var checkMobile = (rule, value, cb) => {
            //  验证邮箱规则的正则表达式
            const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error("请输入合法的手机号码"))
        }
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
            // 控制添加用户对话框的显示和隐藏
            addDialogVisible: false,
            // 控制修改用户对话框的显示和隐藏
            editDialogVisible: false,
            // 添加用户表单数据
            addForm: {
                username: "",
                password: "",
                email: "",
                mobile: ""
            },
            editForm: {
                id: 0,
                username: "",
                email: "",
                mobile: ""
            },
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入用户手机', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
            },
            editFormRules: {
                email: [
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入用户手机', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
            },
            //分配角色对话框的隐藏和出现
            setRoleDialogVisible: false,
            // 分配角色时用户数据
            userRoleInfo: {},
            //所有的角色列表
            rolesList: {},
            //角色列表对话框的下拉默认显示
            selectedRoleId: "--"
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
        //改变增加用户提示框的显示状态
        changeAddDialogVisible() {
            this.addDialogVisible = true
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
                this.$message.error(res.meta.msg)
            }
            else {
                this.$message.success(`修改${userInfo.username}用户状态成功`)
            }
        },
        // 关闭增加用户提示框的操作
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 添加新用户
        addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) this.$message.error("请检查输入内容的格式是否正确")
                else {
                    // console.log(this.addForm)
                    const { data: res } = await this.$http.post("users", this.addForm)

                    if (res.meta.status !== 201) {
                        console.log(res)
                        this.$message.error(res.meta.msg)
                    }
                    else {
                        this.$message.success(res.meta.msg)
                        this.addDialogVisible = false
                        this.getUserList();

                    }
                }
            })
        },
        // 修改用户对话框
        async showEditDialog(row) {
            const { data: res } = await this.$http.get(`users/${row.id}`)
            if (res.meta.status !== 200) return this.$message.error("查询用户信息失败")
            this.editForm = res.data
            this.editDialogVisible = true
        },
        //关闭修改用户对话框时清空表单数据
        editDialogClosed() {
            console.log(this.$refs.editFormRef)
            this.$refs.editFormRef.resetFields()
            this.editForm = {
                email: "",
                mobile: ""
            }
        },
        // 编辑角色
        editUser() {
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) this.$message.error("请检查输入内容的格式是否正确")
                else {
                    console.log(this.editForm)
                    const { data: res } = await this.$http.put(`users/${this.editForm.id}`,
                        { email: this.editForm.email, mobile: this.editForm.mobile })
                    if (res.meta.status !== 200) {
                        this.$message.error(res.meta.msg)
                        // this.editDialogVisible = false
                    }
                    else {
                        this.$message.success(res.meta.msg)
                        this.editDialogVisible = false
                        this.getUserList()
                    }
                }
            })
        },
        deleteUser(userId) {
            const h = this.$createElement
            this.$confirm('', {
                message: h('div', null, [
                    h('i', { class: 'iconfont hpicon-jinggao', style: 'color:#f90;font-size:30px;' }),
                    h('span', { style: 'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;' }, '提示'),
                    h('p', { style: 'margin:10px 0 0 40px;' }, '此操作将永久删除该用户, 是否继续?')
                ]),
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // customClass: 'del-model',
                // closeOnClickModal: false,
                // closeOnPressEscape: false,
                // type: 'warning'
            }).then(async () => {

                const { data: res } = await this.$http.delete(`users/${userId}`)
                if (res.meta.status !== 200) return this.$message.error("用户删除失败")
                else {
                    this.$message({
                        type: 'success',
                        message: `${res.meta.msg}`
                    });
                    this.getUserList();
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 展示分配角色的对话框
        async setRole(userRoleInfo) {
            this.selectedRoleId="--"
            this.userRoleInfo = userRoleInfo
            //展示对话框之前，获取所有角色的列表
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) {
                return this.$http.error("获取当前角色列表失败")
            }
            this.rolesList = res.data
            this.setRoleDialogVisible = true
        },
        //保存分配的角色
        async saveRoleInfo() {
            if (this.selectedRoleId === '--') {
                this.$message.error("请选择分配角色")
            }
            const { data: res } = await this.$http.put(`users/${this.userRoleInfo.id}/role`,
            {rid:this.selectedRoleId})
            if(res.meta.status!==200){
                return this.$message.error("当前用户分配角色失败")
            }
            this.$message.success(res.meta.msg)
            this.getUserList();
            this.setRoleDialogVisible=false
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
.el-pagination {}

/* @import url(); 引入公共css类 */
</style>