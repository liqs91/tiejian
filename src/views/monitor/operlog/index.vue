<template>
  <div class="app-container">
      <el-form v-show="showSearch" ref="queryForm" :inline="true" label-width="68px" :model="queryForm">
        <el-form-item label="系统模块" prop="title">
          <el-input v-model="queryForm.title" clearable placeholder="请输入系统模块"
                    @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="操作人员" prop="operName">
          <el-input v-model="queryForm.operName" clearable placeholder="请输入操作人员"
                    @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="类型" prop="businessType">
          <el-select v-model="queryForm.businessType" clearable placeholder="操作类型"  >
            <el-option v-for="dict in typeOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryForm.status" clearable placeholder="操作状态" >
            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker v-model="dateRange" end-placeholder="结束日期" range-separator="-"
                          start-placeholder="开始日期" style="width: 240px" type="daterange" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" plain type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" plain @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>


        <el-button v-hasPermi="['monitor:operlog:remove']" plain :disabled="multiple" icon="el-icon-delete"
                     type="danger" @click="handleDelete">删除
        </el-button>
        <el-button v-hasPermi="['monitor:operlog:remove']" plain icon="el-icon-delete"
                   type="back" @click="handleClean">清空
        </el-button>
<!--        <el-button v-hasPermi="['monitor:operlog:export']" plain icon="el-icon-download" :loading="exportLoading"-->
<!--                    type="warning" @click="handleExport">批量导出-->
<!--        </el-button>-->
    <br>
    <br>

      <el-table ref="tables" v-loading="loading" border :data="list" :default-sort="defaultSort"
                @selection-change="handleSelectionChange" @sort-change="handleSortChange">
        <el-table-column align="center" type="selection" width="55"/>
        <el-table-column align="center" label="系统模块" prop="title" width="350"/>
        <el-table-column align="center" :formatter="typeFormat" label="操作类型" prop="businessType"/>
        <el-table-column align="center" label="请求方式" prop="requestMethod"/>
        <el-table-column align="center" label="操作人员" prop="operName" :show-overflow-tooltip="true"
                         :sort-orders="['descending', 'ascending']" sortable="custom" width="100"/>
        <el-table-column align="center" label="操作地址" prop="operIp" :show-overflow-tooltip="true" width="130"/>
        <el-table-column align="center" label="操作地点" prop="operLocation" :show-overflow-tooltip="true"/>
        <el-table-column align="center" :formatter="statusFormat" label="操作状态" prop="status"/>
        <el-table-column align="center" label="操作日期" prop="operTime" :sort-orders="['descending', 'ascending']"
                         sortable="custom" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.operTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
          <template slot-scope="scope">
            <el-button plain size="mini" v-hasPermi="['monitor:operlog:query']" icon="el-icon-view" type="info"
                       @click="handleView(scope.row, scope.index)">详细
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



    <!-- 操作日志详细 -->
    <el-dialog append-to-body title="操作日志详细" :visible.sync="open" width="700px">
      <el-form ref="form" label-width="100px" :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
            <el-form-item label="登录信息：">{{ form.operName }} / {{ form.operIp }} /
              {{ form.operLocation }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operParam }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.status === 1" label="异常信息：">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  delOperlog,
  cleanOperlog,
  exportOperlog,
} from '@/api/monitor/operlog'

export default {
  name: 'Operlog',
  data() {
    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 类型数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: {prop: 'operTime', order: 'descending'},
      // 表单参数
      form: {},
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined,
      },
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_oper_type').then((response) => {
      this.typeOptions = response.data
    })
    this.getDicts('sys_common_status').then((response) => {
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

    /** 查询登录日志 */
    getList() {
      this.loading = true
      list(this.addDateRange(this.queryForm, this.dateRange)).then(
        (response) => {
          this.list = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    // 操作日志状态字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 操作日志类型字典翻译
    typeFormat(row) {
      return this.selectDictLabel(this.typeOptions, row.businessType)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryForm.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
      this.handleQuery()
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.operId)
      this.multiple = !selection.length
    },
    /** 排序触发事件 */
    handleSortChange(column) {
      this.queryForm.orderByColumn = column.prop
      this.queryForm.isAsc = column.order
      this.getList()
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.operId || this.ids
      this.$confirm(
        '是否确认删除日志编号为"' + operIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delOperlog(operIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(() => {
        })
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm('是否确认清空所有操作日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return cleanOperlog()
        })
        .then(() => {
          this.getList()
          this.msgSuccess('清空成功')
        })
        .catch(() => {
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryForm = this.queryForm
      this.$confirm('是否确认导出所有操作日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.exportLoading = true
          return exportOperlog(queryForm)
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
