<template>
  <el-card shadow="hover">
    <template #header>
      <vab-icon icon="message-line" />
      消息
    </template>

    <el-table border height="350px" v-loading="loading" :data="infoList">
      <el-table-column label="消息标题" align="center" prop="infoTitle"/>
      <el-table-column label="任务名称" align="center" prop="taskName"/>
      <el-table-column label="用户名称" align="center" prop="userName"/>
      <el-table-column label="任务类型" align="center" prop="taskType"/>
      <el-table-column label="消息类型" align="center" prop="infoType"/>
      <el-table-column label="手机号码" align="center" prop="infoPhone"/>
      <el-table-column label="消息内容" align="center" prop="infoContent" width="300" show-overflow-tooltip/>
      <el-table-column label="阅读时间" align="center" prop="readTime" width="180"/>
      <el-table-column label="阅读状态" align="center" prop="readState"/>
      <el-table-column label="消息状态" align="center" prop="infoState"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="report" icon="el-icon-view" @click="handleView(scope.row)"
                     v-hasPermi="['api:info:query']">详情
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['api:info:remove']">删除
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
  </el-card>
</template>

<script>
  import {delInfo, listInfo} from "@/api/service/info";

  export default {
    data() {
      return {
        loading: true,
        showSearch: true,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        infoList: [],
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          taskType: null,
          infoType: null,
        },
        taskTypeOptions: [],
        infoTypeOptions: [],
      };
    },


    created() {
      this.getList();
      this.getDicts('task_type').then((response) => {
        this.taskTypeOptions = response.data
      })
      this.getDicts('info_type').then((response) => {
        this.infoTypeOptions = response.data
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
      //查询消息列表
      getList() {
        this.loading = true;
        listInfo(this.queryForm).then(response => {
          this.infoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //搜索按钮操作
      handleQuery() {
        this.queryForm.pageNo = 1;
        this.getList();
      },
      //重置按钮操作
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      //新增按钮操作
      handleAdd() {

      },
      //查看详情
      handleView(row) {
        this.$refs['refView'].showPageView(row)
      },
      //删除按钮操作
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除消息编号为"' + ids + '"的数据项？').then(function () {
          return delInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
    }
  }
</script>
