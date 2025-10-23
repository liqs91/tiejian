<template>
  <div class="app-container">

      <el-form v-show="showSearch" ref="queryForm" :inline="true" label-width="68px" :model="queryForm">
        <el-form-item label="登录地址" prop="ipaddr">
          <el-input v-model="queryForm.ipaddr" clearable placeholder="请输入登录地址"
                    @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="queryForm.userName" clearable placeholder="请输入用户名称"
                    @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryForm.status" clearable placeholder="登录状态"  >
            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="登录时间">
          <el-date-picker v-model="dateRange" end-placeholder="结束日期" range-separator="-"
                          start-placeholder="开始日期"   type="daterange" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" plain type="primary" @click="handleQuery">搜索
          </el-button>
          <el-button icon="el-icon-refresh" plain  @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>



        <el-button v-hasPermi="['monitor:logininfor:remove']" :disabled="multiple" icon="el-icon-delete"
                   type="danger" plain @click="handleDelete">删除
        </el-button>
        <el-button v-hasPermi="['monitor:logininfor:remove']" icon="el-icon-delete"  plain  type="back"
                   @click="handleClean">清空
        </el-button>
<!--        <el-button v-hasPermi="['monitor:logininfor:export']" icon="el-icon-download" :loading="exportLoading"-->
<!--                   plain type="warning" @click="handleExport">批量导出-->
<!--        </el-button>-->
    <br>
    <br>


      <el-table ref="tables" v-loading="loading" border :data="list" :default-sort="defaultSort"
                @selection-change="handleSelectionChange" @sort-change="handleSortChange">
        <el-table-column align="center" type="selection" width="55"/>
        <el-table-column align="center" label="用户名称" prop="userName" :show-overflow-tooltip="true"
                         :sort-orders="['descending', 'ascending']" sortable="custom"/>
        <el-table-column align="center" label="登录地址" prop="ipaddr" :show-overflow-tooltip="true" width="130"/>
        <el-table-column align="center" label="登录地点" prop="loginLocation" :show-overflow-tooltip="true"/>
        <el-table-column align="center" label="浏览器" prop="browser" :show-overflow-tooltip="true"/>
        <el-table-column align="center" label="操作系统" prop="os"/>
        <el-table-column align="center" :formatter="statusFormat" label="登录状态" prop="status"/>
        <el-table-column align="center" label="操作信息" prop="msg"/>
        <el-table-column align="center" label="登录日期" prop="loginTime" :sort-orders="['descending', 'ascending']"
                         sortable="custom" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.loginTime) }}</span>
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

  </div>
</template>

<script>
import {
  list,
  delLogininfor,
  cleanLogininfor,
  exportLogininfor,
} from '@/api/monitor/logininfor'

export default {
  name: 'Logininfor',
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
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: {prop: 'loginTime', order: 'descending'},
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        ipaddr: undefined,
        userName: undefined,
        status: undefined,
      },
    }
  },
  created() {
    this.getList()
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

    /** 查询登录日志列表 */
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
    // 登录状态字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
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
      this.ids = selection.map((item) => item.infoId)
      this.multiple = !selection.length
    },
    /** 排序触发事件 */
    handleSortChange(column) {
      this.queryForm.orderByColumn = column.prop
      this.queryForm.isAsc = column.order
      this.getList()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const infoIds = row.infoId || this.ids
      this.$confirm(
        '是否确认删除访问编号为"' + infoIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delLogininfor(infoIds)
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
      this.$confirm('是否确认清空所有登录日志数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return cleanLogininfor()
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
          return exportLogininfor(queryForm)
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
