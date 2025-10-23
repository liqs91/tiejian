<template>
  <div class="app-container">

    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.dictLabel" clearable placeholder="请输入字典标签"
                      @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryForm.dictName" clearable placeholder="请输入字典名称"
                      @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-button v-hasPermi="['system:dict:add']" icon="el-icon-plus" plain style="float: right" type="primary"
                   @click="handleAdd">新增
        </el-button>
      </vab-query-form-right-panel>
    </vab-query-form>


    <el-table v-loading="loading" border :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column v-if="false" align="center" label="字典编码" prop="dictCode"/>
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">{{ queryForm.pageSize * (queryForm.pageNo - 1) + (scope.$index + 1) }}</template>
      </el-table-column>
      <el-table-column align="center" label="字典标签" prop="dictLabel"/>
      <el-table-column align="center" label="字典键值" prop="dictValue"/>
      <el-table-column align="center" label="字典排序" prop="dictSort"/>
      <el-table-column align="center" :formatter="statusFormat" label="状态" prop="status"/>
      <el-table-column align="center" label="备注" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column align="center" label="创建时间" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" v-hasPermi="['system:dict:edit']" icon="el-icon-edit" type="primary"
                     @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button plain size="mini" v-hasPermi="['system:dict:remove']" icon="el-icon-delete" type="danger"
                     @click="handleDelete(scope.row)">删除
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

    <!-- 新增或修改参数配置对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="字典类型">
          <el-input v-model="form.dictType" :disabled="true"/>
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入数据标签"/>
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入数据键值"/>
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number v-model="form.dictSort" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{
                dict.dictLabel
              }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入内容" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listData,
  getData,
  delData,
  addData,
  updateData,
  exportData,
} from '@/api/system/dict/data'
import {listType, getType} from '@/api/system/dict/type'

export default {
  name: 'Data',
  data() {
    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典表格数据
      dataList: [],
      // 默认字典类型
      defaultDictType: '',
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictLabel: [
          {required: true, message: '数据标签不能为空', trigger: 'blur'},
        ],
        dictValue: [
          {required: true, message: '数据键值不能为空', trigger: 'blur'},
        ],
        dictSort: [
          {required: true, message: '数据顺序不能为空', trigger: 'blur'},
        ],
      },
    }
  },
  created() {
    const dictId = this.$route.params && this.$route.params.dictId
    this.getType(dictId)
    this.getTypeList()
    this.getDicts('sys_normal_disable').then((response) => {
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

    /** 查询字典类型详细 */
    getType(dictId) {
      getType(dictId).then((response) => {
        this.queryForm.dictType = response.data.dictType
        this.defaultDictType = response.data.dictType
        this.getList()
      })
    },
    /** 查询字典类型列表 */
    getTypeList() {
      listType().then((response) => {
        this.typeOptions = response.rows
      })
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true
      listData(this.queryForm).then((response) => {
        this.dataList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 数据状态字典翻译
    // eslint-disable-next-line no-unused-vars
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        dictCode: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        dictSort: 0,
        status: '0',
        remark: undefined,
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryForm.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryForm.dictType = this.defaultDictType
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '新增字典数据'
      this.form.dictType = this.queryForm.dictType
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.dictCode)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const dictCode = row.dictCode || this.ids
      getData(dictCode).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改字典数据'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.dictCode != undefined) {
            // eslint-disable-next-line no-unused-vars
            updateData(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            // eslint-disable-next-line no-unused-vars
            addData(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictCodes = row.dictCode || this.ids
      this.$confirm(
        '是否确认删除字典编码为"' + dictCodes + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delData(dictCodes)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(() => {
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryForm = this.queryForm
      this.$confirm('是否确认导出所有数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.exportLoading = true
          return exportData(queryForm)
        })
        .then((response) => {
          this.download(response.msg)
          this.exportLoading = false
        })
        .catch(() => {
        })
    },
  },
}
</script>
