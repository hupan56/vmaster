<!--  -->
<template>
    <div class=''>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->

            <!-- <el-table :data="cateList" style="width: 100%" row-key="cat_id" :border="true" lazy
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column prop="cat_id" label="#" width="180">
                </el-table-column>
                <el-table-column prop="cat_name" label="商品名称" width="180">
                </el-table-column>
                <el-table-column prop="cat_pid" label="排序"></el-table-column>
                <el-table-column prop="cat_pid" label="操作">

                </el-table-column>
            </el-table> -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false"
                :expand-type="false" :show-index="true" index-text="#" :border="true" :show-row-hover="false">
                <!--是否有效  -->
                <template slot="isOk" slot-scope="scope">
                    <i class="iconfont hpicon-icon-test" v-if="scope.row.cat_deleted === false"></i>
                    <i class="iconfont hpicon-cuowu" v-if="scope.row.cat_deleted === true"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag type="danger" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="warning" size="mini" v-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" v-if="scope.row.cat_level === 2">三级</el-tag>
                </template>
                <!--操作 -->
                <template slot="opt" slot-scope="scope">
                    <!-- 修改按钮 -->

                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCate(scope.row)">
                        编辑
                    </el-button>
                    <!-- 删除按钮 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">
                        删除
                    </el-button>

                </template>
            </tree-table>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 30, 50]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <!-- 添加分类对话框 -->
            <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
                <!-- 添加分类的表单 -->
                <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类">
                        <!-- 多级联调 -->
                        <!-- options用来指定数据源 -->
                        <!-- props用来指定配置项 -->
                        <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                            @change="parentCateChanged" :clearable="true" :append-to-body="false"></el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 编辑分类对话框 -->
            <el-dialog title="添加分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClosed">
                <!-- 添加分类的表单 -->
                <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="editCateForm.cat_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editCate">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    //import引入的组件需要注入到对象中才能使用、
    name: "CategoriesCard",
    components: {},
    data() {
        //这里存放数据
        return {
            //商品分类的数据，默认为空
            cateList: [],
            // 总数据条数
            total: 0,
            // 控制添加分类对话框的显示
            addCateDialogVisible: false,
            // 控制编辑分类对话框的显示
            editCateDialogVisible: false,
            //父级分类的列表
            parentCateList: [],
            //获取商品分类时发送的请求参数
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            //增加表单时填写的数据
            addCateForm: {
                cat_pid: 0,
                //将要添加分类的名称
                cat_name: "",
                // 默认添加的分类是一级分类
                cat_level: 0
            },
            //编辑表单时填写的数据
            editCateForm: {
                cat_id: 0,
                //将要添加分类的名称
                cat_name: ""
            },
            // 添加分类名称的规则验证
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ]

            },
            // 编辑分类名称的规则验证
            editCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ]

            },
            //为table指定列的定义
            columns: [
                {
                    label: "分类名称",
                    prop: 'cat_name',
                    width: "400px"
                },
                {
                    label: "是否有效",
                    //模板列
                    type: "template",
                    //模板名称
                    template: 'isOk',

                }
                , {
                    label: "排序",
                    //模板列
                    type: "template",
                    //模板名称
                    template: 'order',

                }, {
                    label: "操作",
                    //模板列
                    type: "template",
                    //模板名称
                    template: 'opt',

                }
            ],
            //级联配置属性
            cascaderProps: {
                value: "cat_id",
                expandTrigger: 'hover',
                label: 'cat_name',
                children: "children",
                checkStrictly: true
            },
            //级联的父级节点
            selectedKeys: []


        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get("categories", { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error("获取商品分类失败");
            this.cateList = res.data.result
            this.total = res.data.total
        },
        //监听pagesize改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getCateList()
        },
        //监听pagenum改变
        handleCurrentChange(newPageNum) {
            this.queryInfo.pagenum = newPageNum;
            this.getCateList();
        },
        //显示添加分类对话框要进行的操作
        showAddCateDialog() {
            //先获取父级分类的数据列表
            this.getParentCateList();
            this.addCateDialogVisible = true;
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get("categories", {
                params: {
                    type: 2
                }
            })
            if (res.meta.status !== 200) return this.$message.error("获取父级分类数据失败")

            this.parentCateList = res.data
            console.log(this.parentCateList)
        },
        //选择项发生变化触发这个函数
        parentCateChanged() {
            //如果selectedKeys数组的length大于0，证明选中的父级分类
            if (this.selectedKeys.length > 0) {
                this.addCateForm.cat_pid = this.selectedKeys
                [this.selectedKeys.length - 1];
                //当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                //初始值
                this.addCateForm.cat_pid = 0;
                //当前分类的等级赋值
                this.addCateForm.cat_level = 0;
            }

            console.log(this.selectedKeys)
        },
        //点击按钮，添加新的分类
        addCate() {
            this.$refs.addCateFormRef.validate(async (valid) => {
                if (!valid) {
                    this.$message.error("请检查输入内容格式是否正确")
                    return
                }
                const { data: res } = await this.$http.post("categories", this.addCateForm)
                if (res.meta.status !== 201) {
                    this.$message.error("添加新的分类失败")
                    return
                } else {
                    this.$message.success("添加新的分类成功")
                    this.getCateList();
                    this.addCateDialogVisible = false
                }
            })

        },
        deleteCate(id) {
            const h = this.$createElement
            this.$confirm('', {
                message: h('div', null, [
                    h('i', { class: 'iconfont hpicon-jinggao', style: 'color:#f90;font-size:30px;' }),
                    h('span', { style: 'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;' }, '提示'),
                    h('p', { style: 'margin:10px 0 0 40px;' }, '此操作将永久删除该文件, 是否继续?')
                ]),
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // customClass: 'del-model',
                // closeOnClickModal: false,
                // closeOnPressEscape: false,
                // type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`categories/${id}`)
                if (res.meta.status !== 200) return this.$message.error("删除分类失败")
                this.$message.success("删除分类成功 ")
                this.getCateList()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        // 显示编辑框
        async showEditCate(cateInfo) {
            const { data: res } = await this.$http.get(`categories/${cateInfo.cat_id}}`)
            if (res.meta.status != 200) {
                this.$message.error("查询分类信息失败")
                this.editCateDialogVisible = true;
                this.editCateForm.cat_name = cateInfo.cat_name
                this.editCateForm.cat_id = cateInfo.cat_id
            } else {
                this.editCateDialogVisible = true;
                this.editCateForm.cat_name = res.data.cat_name
                this.editCateForm.cat_id = res.data.cat_id
            }
        },
        //编辑
        async editCate() {
            const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name })
            if (res.meta.status !== 200) return this.$message.error("修改分类信息失败")
            this.$message.success("修改分类信息成功")
            this.getCateList()
            this.editCateDialogVisible = false
        },
        //监听添加对话框的关闭事件
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0

        },
        //监听修改对话框的关闭事件
        editCateDialogClosed() {
            this.$refs.editCateFormRef.resetFields()
            this.editCateForm.cat_pid = 0
            this.editCateForm.cat_name=""
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.getCateList();
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
<style lang='less' scoped>
.treeTable {
    margin-top: 15px;

}

.el-cascader {
    width: 100%
}



/* @import url(); 引入公共css类 */
</style>