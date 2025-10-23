<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" label-width="68px" :model="queryForm">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input v-model="queryForm.ipaddr" clearable placeholder="请输入登录地址" size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="queryForm.userName" clearable placeholder="请输入用户名称" size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" plain type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" plain @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="list.slice((pageNo - 1) * pageSize, pageNo * pageSize)" style="width: 100%">
      <el-table-column align="center" label="序号" type="index">
        <template slot-scope="scope">
          <span>{{ (pageNo - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会话编号" prop="tokenId" :show-overflow-tooltip="true"/>
      <el-table-column align="center" label="登录名称" prop="userName" :show-overflow-tooltip="true"/>
      <el-table-column align="center" label="部门名称" prop="deptName"/>
      <el-table-column align="center" label="主机" prop="ipaddr" :show-overflow-tooltip="true"/>
      <el-table-column align="center" label="登录地点" prop="loginLocation" :show-overflow-tooltip="true"/>
      <el-table-column align="center" label="浏览器" prop="browser"/>
      <el-table-column align="center" label="操作系统" prop="os"/>
      <el-table-column align="center" label="登录时间" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button plain v-hasPermi="['monitor:online:forceLogout']" icon="el-icon-delete" size="mini" type="back" @click="handleForceLogout(scope.row)">强退</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :limit.sync="pageSize"
      :page.sync="pageNo"
      :total="total"/>
  </div>
</template>

<script>
  import { list, forceLogout } from '@/api/monitor/online'

  export default {
    name: 'Online',
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        pageNo: 1,
        pageSize: 10,
        // 查询参数
        queryForm: {
          ipaddr: undefined,
          userName: undefined,
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 查询登录日志列表 */
      getList() {
        this.loading = true
        list(this.queryForm).then((response) => {
          this.list = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.pageNo = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /** 强退按钮操作 */
      handleForceLogout(row) {
        this.$confirm(
          '是否确认强退名称为"' + row.userName + '"的数据项?',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(function () {
            return forceLogout(row.tokenId)
          })
          .then(() => {
            this.getList()
            this.msgSuccess('强退成功')
          })
          .catch(() => {})
      },
    },
  }
</script>
