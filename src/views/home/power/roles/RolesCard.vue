<!--  -->
<template>
    <div class=''>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolelist" :border="true" :stripe="true">
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- <pre>
                            {{ scope.row }}
                        </pre> -->
                        <!-- 渲染权限-->
                        <el-row :class="['bdBottom', i1 === 0 ? 'bdTop' : '', 'vcenter']"
                            v-for="(item, i1) in scope.row.children" :key="item.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item.id)">
                                    {{ item.authName }}
                                </el-tag>
                                <i class="iconfont hpicon-a-youjiantouzhixiangyoujiantou"></i>
                            </el-col>

                            <!-- 渲染二级级和三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[i2 === 0 ? '' : 'bdTop', 'vcenter']" v-for="(it, i2) in item.children"
                                    :key="it.id">
                                    <el-col :span="6">
                                        <el-tag closable type="success" @close="removeRightById(scope.row, it.id)">
                                            {{ it.authName }}
                                        </el-tag>
                                        <i class="iconfont hpicon-a-youjiantouzhixiangyoujiantou"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag closable type="warning" v-for="(i, i3) in it.children" :key="i.id"
                                            @close="removeRightById(scope.row, i.id)">

                                            {{ i.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" prop="roleDesc" width="380px">
                    <template slot-scope="scope">
                        <!-- 编辑角色信息 -->
                        <el-button type="primary" size="mini" icon="iconfont hpicon-A"
                            @click="showEditRoleDialog(scope.row)">编辑
                        </el-button>
                        <el-button type="danger" size="mini" icon="iconfont hpicon-shanchu"
                            @click="deleteRole(scope.row)">
                            >删除</el-button>
                        <el-button type="warning" size="mini" icon="iconfont hpicon-xitongshezhi"
                            @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="30%">
            <!-- 角色表单 -->
            <el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRules" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="roleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑角色对话框 -->
        <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="30%">
            <!-- 角色表单 -->
            <el-form ref="editRoleFormRef" :model="editRoleForm" :rules="editRoleFormRules" label-width="80px"
                @close="closeEditRoleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限的对话框 -->
        <el-dialog title="提示" :visible.sync="setRightsDialogVisible" width="30%" @close="setRightDialogClosed">
            <!-- 树形组件 -->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox :default-checked-keys="defKeys" node-key="id"
                :default-expand-all="true" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name: "RolesCard",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            rolelist: [],
            //true时添加角色对话框可见
            addRoleDialogVisible: false,
            //true时修改角色对话框可见
            editRoleDialogVisible: false,
            // true时分配权限列表对话框可见
            setRightsDialogVisible: false,
            // 所有权限的数据
            rightsList: [],
            //角色表单，对应后端需要发送请求的参数
            roleForm: {
                roleName: "",
                roleDesc: ""
            },
            // 角色表单验证规则
            roleFormRules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
                ]
            },
            editRoleForm: {
                roleName: "",
                roleDesc: "",
                roleId: ""
            },
            // 角色表单验证规则
            editRoleFormRules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
                ],
            },
            // 树形组件的绑定对象
            treeProps: {
                label: "authName",
                children: "children"
            },
            // 默认选中的节点Id值
            defKeys: [],
            //当前选中节点的id
            RoleId:0,
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        async getRolesList() {
            const { data: res } = await this.$http.get("roles")
            if (res.meta.status !== 200) {
                return this.$message.error("获取角色列表失败")
            }
            this.rolelist = res.data

        },
        // 添加角色
        async addRole() {
            const { data: res } = await this.$http.post("roles", this.roleForm)
            if (res.meta.status !== 201) {
                return this.$message.error(res.meta.msg)
            }
            else {
                this.$message.success("角色添加成功")
                this.getRolesList()
                this.roleForm = {
                    roleName: "",
                    roleDesc: ""
                }
                this.addRoleDialogVisible = false
            }
        },
        //显示编辑角色对话框
        async showEditRoleDialog(roleInfo) {
            // 将数据回显
            const { data: res } = await this.$http.get(`roles/${roleInfo.id}`)
            if (res.meta.status !== 200) {
                return this.$message.error("获取角色数据失败")
            }
            else {
                this.editRoleForm = res.data;
            }
            this.editRoleDialogVisible = true
            console.log(roleInfo)
        },
        // 取消编辑角色
        cancelEdit() {
            this.editRoleDialogVisible = false
            this.$message.info("取消编辑角色")
        },
        // 取消添加角色
        cancelAdd() {
            this.roleForm = {
                roleName: "",
                roleDesc: ""
            }
            this.addRoleDialogVisible = false
            this.$message.info("取消添加角色")
        },
        //编辑角色
        editRole() {
            this.$refs.editRoleFormRef.validate(async (valid) => {
                if (!valid) {
                    this.$message.error("请检查输入内容的格式")
                } else {
                    const { data: res } = await this.$http.put(`roles/${this.editRoleForm.roleId}`,
                        { roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc })
                    if (res.meta.status !== 200) {
                        this.$message.error("编辑角色失败")
                    } else {
                        this.$message.success("编辑角色成功")
                        this.getRolesList()
                        this.editRoleDialogVisible = false
                    }
                }
            })
        },
        // 删除角色
        deleteRole(userInfo) {
            // 提醒是否删除
            const h = this.$createElement
            this.$confirm('', {
                message: h('div', null, [
                    h('i', { class: 'iconfont hpicon-jinggao', style: 'color:#f90;font-size:30px;' }),
                    h('span', { style: 'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;' }, '提示'),
                    h('p', { style: 'margin:10px 0 0 40px;' }, '此操作将永久删除该角色, 是否继续?')
                ]),
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // customClass: 'del-model',
                // closeOnClickModal: false,
                // closeOnPressEscape: false,
                // type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`roles/${userInfo.id}`)
                if (res.meta.status !== 200) {
                    this.$message.error("删除角色失败")
                } else {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getRolesList();
                    this.editRoleDialogVisible = false;
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        closeEditRoleForm() {
            console.log("close")
            this.$refs.editRoleFormRef.resetFields();
        },
        // 根据Id删除对应的权限
        removeRightById(role, rightId) {
            const h = this.$createElement
            this.$confirm('', {
                message: h('div', null, [
                    h('i', { class: 'iconfont hpicon-jinggao', style: 'color:#f90;font-size:30px;' }),
                    h('span', { style: 'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;' }, '提示'),
                    h('p', { style: 'margin:10px 0 0 40px;' }, '此操作将永久删除该权限, 是否继续?')
                ]),
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // customClass: 'del-model',
                // closeOnClickModal: false,
                // closeOnPressEscape: false,
                // type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status !== 200) {
                    this.$message.error("删除权限失败")
                } else {
                    this.$message({
                        type: 'success',
                        message: '删除权限成功!'
                    });
                    // 不建议重新获取权限会造成全局渲染
                    // this.getRolesList()
                    // 建议重新赋值即可
                    role.children = res.data;
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 展示分配权限的对话框
        async showSetRightDialog(Role) {
            // this.defKeys=[]
            this.RoleId = Role.id
            this.setRightsDialogVisible = true
            const { data: res } = await this.$http.get("rights/tree")
            if (res.meta.status !== 200) return this.$message.error("获得权限列表失败")
            this.rightsList = res.data;
            console.log(this.rightsList)
            //递归获取三级节点的Id
            this.getLeafKeys(Role, this.defKeys)

        },
        // 点击后
        handleCheckChange() {

        },
        // 递归获取权限节点树的选中节点，三级权限
        getLeafKeys(node, arr) {
            //如果是三级节点
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(element => {
                this.getLeafKeys(element, arr)
            });
        },
        //权限对话框关闭将数组清空
        setRightDialogClosed() {
            this.defKeys = []
        },
        //权限列表确认后
        async allotRights() {
            // console.log(this.$refs.treeRef)
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),

            ]
            // console.log(keys)
            const idStr = keys.join(",")
            const { data: res } = await this.$http.post(`roles/${this.RoleId}}/rights`, { rids: idStr })
            if(res.meta.status!==200)return this.message.error("角色授权失败")
            this.$message.success(res.meta.msg)
            this.getRolesList()
            this.setRightsDialogVisible = false;
     
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.getRolesList()
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
.el-tag {
    margin: 7px;
}

.bdTop {
    border-top: 1px solid #eee;
}

.bdBottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}

/* @import url(); 引入公共css类 */
</style>