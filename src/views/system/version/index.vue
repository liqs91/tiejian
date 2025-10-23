<template>
  <div class="app-container">

    <vab-query-form>
      <vab-query-form-left-panel :span="20">
        <el-form ref="queryForm" :inline="true" label-width="68px" :model="queryForm">

          <el-form-item prop="versionNo">
            <el-input v-model="queryForm.versionNo" clearable placeholder="请输入版本号"/>
          </el-form-item>

          <el-form-item prop="versionType">
            <el-select v-model="queryForm.versionType" clearable placeholder="版本类型" size="small">
              <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                         :value="dict.dictValue"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" plain @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>

      <vab-query-form-right-panel :span="4">
        <el-button icon="el-icon-plus" type="success" plain @click="handleAdd">
          新增
        </el-button>
      </vab-query-form-right-panel>
    </vab-query-form>


    <el-table v-loading="loading" border :data="list">
      <el-table-column show-overflow-tooltip align="center" fixed label="序号" width="70">
        <template slot-scope="scope">
          {{ queryForm.pageSize * (queryForm.pageNo - 1) + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="版本号" prop="versionNo"/>
      <el-table-column align="center" :formatter="typeFormat" label="版本类型" prop="versionType"/>
      <el-table-column align="center" :formatter="statusFormat" label="是否有效" prop="status"/>
      <el-table-column align="center" label="发布日期" prop="cjsj"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-view" type="even"
                     @click="handleSee(scope.row)">修改
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        background
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"/>

    <!-- 新增或修改公告对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="50%">
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本号" prop="versionNo">
              <el-input v-model.trim="form.versionNo" placeholder="请输入版本号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本类型" prop="versionType">
              <el-select v-model.trim="form.versionType" placeholder="请选择版本类型">
                <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                           :value="dict.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本状态" prop="status">
              <el-select v-model.trim="form.status" placeholder="请选择版状态">
                <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                           :value="dict.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="版本内容" prop="versionContent">
              <Editor v-model.trim="form.versionContent" :min-height="192"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <View ref="view"/>
  </div>
</template>

<script>
import {addVersion, delVersion, listVersion, updateVersion,} from '@/api/system/version'
import Editor from '@/components/Editor'

export default {
  name: 'version',
  components: {
    Editor
  },
  data() {
    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 公告表格数据
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [{
        dictValue: "1",
        dictLabel: "监管端",
      }, {
        dictValue: "2",
        dictLabel: "企业端",
      },],
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        versionNo: null,
        versionType: null,
      },
      // 表单参数
      form: {
        id: null,
        versionNo: null,
        versionType: "",
        versionContent: null,
      },
      // 表单校验
      rules: {
        versionNo: [
          {required: true, message: '版本号不能为空', trigger: 'blur'},
        ],
        versionType: [
          {required: true, message: '版本类型不能为空', trigger: 'change'},
        ],
        status: [
          {required: true, message: '版本状态不能为空', trigger: 'change'},
        ],
        versionContent: [
          {required: true, message: '版本内容不能为空', trigger: 'blur'},
        ]
      },
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_notice_status').then((response) => {
      this.statusOptions = response.data
    })
  },
  methods: {

    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.getList()
    },

    /** 查询公告列表 */
    getList() {
      this.loading = true
      listVersion(this.queryForm).then((response) => {
        this.list = response.rows
        this.total = response.total
      }).finally(_ => {
        this.loading = false
      })
    },
    // 公告状态字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 公告状态字典翻译
    typeFormat(row) {
      return this.selectDictLabel(this.typeOptions, row.versionType)
    },
    // 取消按钮
    cancel() {
      this.resetForm('form');
      this.open = false
      this.getList()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryForm.pageNo = 1;
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery();
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      })
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.title = '新增系统版本';
      this.form = {
        id: undefined,
        versionNo: undefined,
        versionType: undefined,
        versionContent: undefined,
        status: undefined,
      },
          this.open = true;
    },

    handleSee(row) {
      this.form = row
      this.open = true;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {

          this.form.versionContent.replace(/<[^>]+>/g, "")
          if (this.form.id != undefined) {


            updateVersion(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
              console.log(response)
            })
          } else {

            addVersion(this.form).then((response) => {

              this.msgSuccess('新增成功')
              this.open = false
              this.getList();
              console.log(response)
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$confirm(
          '是否确认删除公告标题为【' + row.versionNo + '】的数据项?',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(function () {
        return delVersion(ids)
      })
          .then(() => {
            this.getList()
            this.msgSuccess('删除成功');
          })
          .catch(() => {
          })
    },
  },
}
</script>
