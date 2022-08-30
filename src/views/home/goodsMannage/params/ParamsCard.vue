<!--  -->
<template>
    <div class=''>
        <el-card>
            <el-alert title="注意：只允许第三级分类设置相关参数!" type="warning" show-icon :closable="true" width="500px">
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>请选择商品分类：</span>
                    <!-- option数据源 -->
                    <!-- v-model选中的数据成为一个数组 -->
                    <el-cascader :options="catelist" :props="cateProps" @change="handleChange" :clearable="true"
                        v-model="selectedCateKeys"></el-cascader>
                </el-col>
            </el-row>
            <!-- tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick" element-loading-text="loading"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" :border="true" :stripe="true">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key=i :closable="true"
                                    @close="handleClose(i, scope.row)">
                                    {{  item  }}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <!-- 操作列 -->
                        <el-table-column label="操作" width="200px">
                            <template slot-scope="scope">
                                <!-- 修改按钮 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row)">
                                    编辑
                                </el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="deleteParams(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加属性</el-button>
                    <!-- 静态参数表格 -->
                    <el-table :data="onlyTableData" :border="true" :stripe="true">
                        <!-- 展开行 -->
                         <!-- 展开行 -->
                         <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key=i :closable="true"
                                    @close="handleClose(i, scope.row)">
                                    {{  item  }}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                        <!-- 操作列 -->
                        <el-table-column label="操作" width="200px">
                            <template slot-scope="scope">
                                <!-- 修改按钮 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row)">
                                    编辑
                                </el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="deleteParams(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <!-- 添加参数的对话框 -->
            <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
                <!-- 验证表单 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px"
                    class="demo-ruleForm">
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改参数的对话框 -->
            <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="30%"
                @close="editDialogClosed">
                <!-- 验证表单 -->
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px"
                    class="demo-ruleForm">
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="editForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editParams">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import Aside from '@/components/Aside.vue';
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';




export default {
    //import引入的组件需要注入到对象中才能使用
    name: "ParamsCard",
    components: { Aside },
    data() {
        //这里存放数据
        return {
            selectedCateKeys: [],
            //商品分类列表
            catelist: [],
            //级联选择器配置
            cateProps: {
                expandTrigger: 'hover',
                label: "cat_name",
                value: "cat_id",
                children: "children"
            },
            // loading: true,
            //被激活页签的名称
            activeName: 'many',
            //动态参数的数据
            manyTableData: [],
            //静态属性的数据
            onlyTableData: [],
            //添加属性对话框
            addDialogVisible: false,
            //编辑属性对话框
            editDialogVisible: false,
            //添加表单数据的对象
            addForm: {
                attr_name: "",
                attr_sel: "many",
                // attr_vals: ""
            },
            editForm: {
                attr_name: "",
                attr_sel: "many",
                // attr_vals: ""
            },
            attr_id: 0,
            //表单数据的验证对象
            addFormRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 1, max: 20, message: "参数名称长度在1到20之间", trigger: 'blur', }]
            },
            editFormRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 1, max: 20, message: "参数名称长度在1到20之间", trigger: 'blur', }]
            },
            // // 点击新增标签弹出输入框
            // inputVisible:false,
            // //文本框输入的内容,需要设置多个
            // inputValue:""
        };
    },
    //计算属性 类似于data概念
    computed: {
        //如果按钮需要被禁用则返回true，否则返回false
        isBtnDisabled() {
            if (this.selectedCateKeys.length !== 3) {
                return true;
            }
            else {
                return false;
            }
        },
        //当前选中的三级分类的id
        cateId() {
            if (this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[2]
            }
            else {
                return null
            }
        },
        //动态计算标题的文本
        titleText() {
            if (this.activeName === "many") {
                return '动态参数'
            } else {
                return '静态属性'
            }
        }

    },
    //监控data中的数据变化
    watch: {
        activeName(newValue, oldValue) {
            this.addForm.attr_sel = newValue
            this.editForm.attr_sel = newValue
        }
    },
    //方法集合
    methods: {
        // 防抖
        VueDebounce(fnName, time) {
            let timeout = null;
            return function () {
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(() => {
                    this[fnName]();
                }, time);
            };
        },
        //获得所有商品分类列表
        async getCateList() {
            const { data: res } = await this.$http.get("categories")
            if (res.meta.status !== 200) return this.$message.error("获取商品分类列表失败")
            this.catelist = res.data
            console.log(this.catelist)
        },
        //级联选择器改变后的值
        handleChange(value) {
            this.getParamsData()
        },
        //tabs页签点击事件的处理函数
        handleTabClick(tab, event) {
            console.log(this.activeName)
            this.getParamsData()
        },
        //防抖使用
        // getParamsData(){
        //     this.VueDebounce(this.getParamsData1(),2000)
        // },
        //获得参数的延时列表数据方法
        async getParamsData() {
            this.manyTableData = []
            this.onlyTableData = []
            const loading = this.$loading({
                lock: true,//lock的修改符--默认是false
                text: 'Loading',//显示在加载图标下方的加载文案
                spinner: 'el-icon-loading',//自定义加载图标类名
                background: 'rgba(0, 0, 0, 0.7)',//遮罩层颜色
                target: document.querySelector('.el-tabs')//loading覆盖的dom元素节点
            });
            //根据当前所选分类的id和当前所处的面板，获取对应的参数
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
            if (res.meta.status !== 200) {
                this.$message.error("获取分类参数失败")
                //成功回调函数停止加载
                setTimeout(() => {
                    loading.close();
                }, 500)
            } else {

                // 将动态参数字符串拆成几个特殊的字段
                res.data.forEach((item) => {
                    // item.attr_vals为空时item.attr_vals为false
                    item.attr_vals = item.attr_vals ?
                        item.attr_vals.split(',') : []
                    //控制文本框的输入和隐藏
                    item.inputVisible = false
                    //文本框中输入的值
                    item.inputValue = ""
                })
                console.log(res.data)
                if (this.activeName === "many") {
                    setTimeout(() => {
                        this.manyTableData = res.data
                        loading.close();
                    }, 500)

                }
                else if (this.activeName === "only") {
                    setTimeout(() => {
                        this.onlyTableData = res.data
                        loading.close();
                    }, 500)

                }
                //成功回调函数停止加载
            }
        },
        //编辑删除时调用的方法（不延时）
        async getParamsData1() {
            //根据当前所选分类的id和当前所处的面板，获取对应的参数
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
            if (res.meta.status !== 200) {
                this.$message.error("获取分类参数失败")
                //成功回调函数停止加载
            } else {
                //   // 将动态参数字符串拆成几个特殊的字段
                //   res.data.forEach((item) => {
                //     // item.attr_vals为空时item.attr_vals为false
                //     item.attr_vals = item.attr_vals ?
                //         item.attr_vals.split(',') : []
                //     //控制文本框的输入和隐藏
                //     item.inputVisible = false
                //     //文本框中输入的值
                //     item.inputValue = ""
                // })
                console.log(res.data)
                console.log(res.data)
                if (this.activeName === "many") {
                    this.manyTableData = res.data
                }
                else if (this.activeName === "only") {
                    this.onlyTableData = res.data
                }
                //成功回调函数停止加载
            }

            // this.selectedCatekeys=value
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
            }
            console.log(this.selectedCateKeys)

        },
        //对话框关闭
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
            this.addForm.attr_name = ""
        },
        //点击按钮添加参数
        addParams() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) {
                    return this.$message.error("请检查输入内容的格式是否正确")
                } else {
                    const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, this.addForm)
                    if (res.meta.status !== 201) {
                        return this.$message.error(`添加${this.titleText}失败`)
                    } else {
                        this.$message.success(`添加${this.titleText}成功`);
                        this.getParamsData();
                        this.addDialogVisible = false
                    }
                }

            })
        },
        //显示编辑表单
        async showEditDialog(userInfo) {
            this.editDialogVisible = true
            const { data: res } = await this.$http.get(`categories/${userInfo.cat_id}/attributes/${userInfo.attr_id}`, {
                attr_sel: this.editForm.attr_sel
            })
            if (res.meta.status != 200) {
                this.$message.error("获取当前属性失败")
            } else {
                this.editForm.attr_name = res.data.attr_name
                this.attr_id = res.data.attr_id
            }

            console.log(userInfo)

        },
        //修改对话框关闭
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
            this.editForm.attr_name = ""
        },
        editParams() {
            // console.log(this.$refs.editFormRef)
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) {
                    return this.$message.error("请检查输入内容的格式是否正确")
                } else {
                    const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.attr_id}`, this.editForm)
                    if (res.meta.status != 200) {
                        this.$message.error(`修改${this.titleText}失败`)
                    } else {
                        this.$message.success(`修改${this.titleText}成功`)
                        this.getParamsData1()
                        this.cateId
                        this.editDialogVisible = false
                    }
                }
            }
            )
        },
        deleteParams(paramsInfo) {
            const h = this.$createElement
            this.$confirm('', {
                message: h('div', null, [
                    h('i', { class: 'iconfont hpicon-jinggao', style: 'color:#f90;font-size:30px;' }),
                    h('span', { style: 'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;' }, '提示'),
                    h('p', { style: 'margin:10px 0 0 40px;' }, `此操作将永久删除该${this.titleText}, 是否继续?`)
                ]),
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // customClass: 'del-model',
                // closeOnClickModal: false,
                // closeOnPressEscape: false,
                // type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${paramsInfo.attr_id}`)
                if (res.meta.status != 200) {
                    return this.$message.error(`删除该${this.titleText}失败`)
                } else {
                    this.$message({
                        type: 'success',
                        message: `删除该${this.titleText}成功!`
                    }
                    );
                    this.getParamsData1();
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: `已取消删除该${this.titleText}`
                });
            });
        },
        // 点击增加标签属性
        showInput(row) {
            row.inputVisible = true;
            // 页面重新渲染后才执行
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 按下回车键触发的事件
        async handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = "";
                row.inputVisible = false;
                return
            }
            //后续处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ""
            row.inputVisible = false;
            //发起请求
           this.saveAttrVals(row)
        },
        // 将对attr_vals的操作保存在数据库
        async saveAttrVals(row) {
            //发起请求
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(',')

            })
            if (res.meta.status !== 200) {
                this.$message.error(`修改${this.titleText}失败`)
            }
            else {
                this.$message.success(`修改${this.titleText}成功`)

            }
        },
        //处理删除标签
        handleClose(i, row) {
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
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
<style lang="less" scoped>
.cat_opt {
    margin: 15px 0 15px;
}

.el-tag {
    margin: 10px
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    // vertical-align: bottom;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

/* @import url(); 引入公共css类 */
</style>