<template>
  <div class="list-container">
    <el-form :model="queryForm" ref="queryForm" size="small" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item label="" prop="userName">
        <el-input
          v-model="queryForm.userName"
          placeholder="用户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="taskName">
        <el-input
          v-model="queryForm.taskName"
          placeholder="任务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="dailyDate">
        <el-date-picker clearable
                        v-model="queryForm.dailyDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="日期"/>
      </el-form-item>
      <el-form-item label="" prop="dailyState">
        <el-input
          v-model="queryForm.dailyState"
          placeholder="日报状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="mini" plain icon="el-icon-search" @click="handleQuery" type="primary">搜索</el-button>
        <el-button size="mini" plain icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        <el-button size="mini" plain icon="el-icon-download" @click="handleExport"
                   v-hasPermi="['api:daily:export']"
                   type="warning">导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="loading" :data="dailyList">
                <el-table-column label="日期" align="center" prop="dailyDate" width="150">
                  <template slot-scope="scope">
                    <el-tag >
                      <vab-icon icon="calendar-2-line"/>
                      {{ scope.row.dailyDate }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="提交人" align="center" prop="userName" width="130">
                  <template slot-scope="scope">
                    <el-tag type="success">
                      <vab-icon icon="user-fill"/>
                      {{ scope.row.userName }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="关联任务" align="center" prop="taskName" width="150"/>
                <el-table-column label="今日完成工作" align="center" prop="dayContent" show-overflow-tooltip  />
                <el-table-column label="今日未完成工作" align="center" prop="dayUncontent"  show-overflow-tooltip  width="200" />
                <el-table-column label="需协调工作" align="center" prop="joinContent"  show-overflow-tooltip width="200" />
                <el-table-column label="提交时间" align="center" prop="submitTime" width="180" >
                  <template slot-scope="scope">
                    <el-tag type="info" >
                      <vab-icon icon="time-line"/>
                      {{ scope.row.submitTime }}
                    </el-tag>
                  </template>
                </el-table-column>
<!--                <el-table-column label="日报状态" align="center" prop="dailyState"/>
                <el-table-column label="点赞数" align="center" prop="clickSum"/>
                <el-table-column label="已读数" align="center" prop="readSum"/>
                <el-table-column label="评价数" align="center" prop="writeSum"/>-->
                <el-table-column label="操作" align="center" width="220">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="report"
                      icon="el-icon-view"
                      @click="handleView(scope.row)"
                      v-hasPermi="['api:daily:query']"
                    >详情
                    </el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="handleDelete(scope.row)"
                      v-hasPermi="['api:daily:remove']"
                    >删除
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
    <page-view ref="refView" @submit="getList" :key="Math.random()"/>

  </div>
</template>

<script>
import {delDaily, listDaily} from "@/api/service/daily";
import pageView from "@/views/api/daily/components/pageView.vue";

export default {
  name: "Daily",
  components: {pageView},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 日报表格数据
      dailyList: [],
      layout: 'total, sizes, prev, pager, next, jumper',
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        userId: null,
        userName: null,
        taskId: null,
        taskName: null,
        leaderIds: null,
        leaderNames: null,
        sendIds: null,
        sendNames: null,
        dailyType: null,
        dailyDate: null,
        dayContent: null,
        dayUncontent: null,
        joinContent: null,
        submitTime: null,
        dailyState: null,
        clickSum: null,
        readSum: null,
        writeSum: null,
        status: null,
        createName: null,
        updateName: null,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {

    //查看详情
    handleView(row) {
      this.$refs['refView'].showPageView(row)
    },


    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.getList()
    },

    //查询日报列表
    getList() {
      this.loading = true;
      listDaily(this.queryForm).then(response => {
        this.dailyList = response.rows;
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
      this.resetForm('queryForm')
      this.handleQuery();
    },

    //新增按钮操作
    handleAdd() {

    },
    //修改按钮操作
    handleUpdate(row) {

    },

    //删除按钮操作
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除日报编号为"' + ids + '"的数据项？').then(function () {
        return delDaily(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    //导出按钮操作
    handleExport() {

    }
  }
};
</script>
<style lang="scss" scoped>
.list-container {
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    outline: none;

    .list-item {
      padding: $base-padding;
      border-bottom: 1px solid $base-border-color;

      &-meta {
        display: flex;
        flex: 1 1;
        align-items: flex-start;

        &-avatar {
          margin-right: 16px;

          :deep() {
            .el-image {
              width: 61px;
              height: 61px;
            }
          }
        }

        &-content {
          flex: 1 0;
          width: 0;
          color: rgba(0, 0, 0, 0.85);
        }

        &-title {
          margin-top: 11px;
          margin-bottom: 4px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.85);
        }

        &-description {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
        }

        &-item {
          display: inline-block;
          height: 61px;
          margin-left: 40px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          vertical-align: middle;

          > span {
            line-height: 30px;
          }

          > p {
            margin-top: 4px;
            margin-bottom: 0;
          }
        }

        :deep() {
          .el-progress {
            margin-top: 21px;
          }
        }
      }
    }
  }
}
</style>
