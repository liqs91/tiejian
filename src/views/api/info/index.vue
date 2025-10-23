<template>
  <div class="order">
    <el-card class="order-card1" shadow="hover">
      <el-row class="order-card1-content">
        <el-col :span="4">
          <p>消息总数</p>
          <h1>{{ chartVo.total }}</h1>
        </el-col>
        <el-col :span="4">
          <p>已读数量</p>
          <h1>{{ chartVo.yd }}</h1>
        </el-col>
        <el-col :span="4">
          <p>未读数量</p>
          <h1>{{ chartVo.wd }}</h1>
        </el-col>
        <el-col :span="12" style="padding: 20px">
          <el-form :model="queryForm" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="" prop="infoType">
              <el-select v-model="queryForm.infoType" clearable placeholder="请选择消息类型">
                <el-option v-for="dict in infoTypeOptions"
                           :key="dict.dictValue"
                           :label="dict.dictLabel"
                           :value="dict.dictValue"/>
              </el-select>

            </el-form-item>
            <el-form-item label="" prop="taskType">
              <el-select v-model="queryForm.taskType" clearable placeholder="请选择任务类型">
                <el-option v-for="dict in taskTypeOptions"
                           :key="dict.dictValue"
                           :label="dict.dictLabel"
                           :value="dict.dictValue"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="report" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button type="warning" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-table border v-loading="loading" :data="infoList">
      <el-table-column label="消息标题" align="center" prop="infoTitle" width="180">
        <template slot-scope="scope">
          <el-tag :type="getTagInfoType(scope.row)">
            <vab-icon icon="message-2-line"/>
            {{ scope.row.infoTitle }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="消息内容" align="center" prop="infoContent" show-overflow-tooltip/>
      <el-table-column label="所属任务" align="center" prop="taskName" width="130">
        <template slot-scope="scope">
                    <span style="color: #1e8bf1;cursor: pointer;" @click="handleTaskView(scope.row)">
                     {{ scope.row.taskName }}
                    </span>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" align="center" prop="taskType" width="130">
        <template slot-scope="scope">
          <el-tag :type="getTagType(scope.row)">
            <vab-icon :icon="getTaskTypeIcon(scope.row)" is-custom-svg/>
            {{ taskTypeFormat(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="阅读状态" align="center" prop="readState" width="130">
        <template slot-scope="scope">
          <el-tag :type="getReadStateTag(scope.row)">
            {{ readStateFormat(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="阅读时间" align="center" prop="readTime" width="180">
        <template slot-scope="scope">
          {{ scope.row.readTime != null ? scope.row.readTime : '/' }}
        </template>
      </el-table-column>
      <!--
            <el-table-column label="消息状态" align="center" prop="infoState" width="110"/>
      -->
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
    <page-view ref="refView" @submit="getList" :key="Math.random()"/>
    <task-page-view ref="refTaskView" @submit="getList" :key="Math.random()"/>
  </div>
</template>

<script>
import {delInfo, listInfo} from "@/api/service/info";
import taskPageView from "@/views/api/task/components/pageView.vue";
import pageView from "@/views/api/info/components/pageView.vue";
import {infoChart} from "@/api/service/chart";

export default {
  name: "Info",
  components: {pageView, taskPageView},
  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      chartVo: {},
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
      readStateOptions: [],
      taskStateOptions: [],
      taskLevelOptions: [],
    };
  },
  created() {
    this.init();
    this.getList();
    this.getDicts('task_type').then((response) => {
      this.taskTypeOptions = response.data
    })
    this.getDicts('info_type').then((response) => {
      this.infoTypeOptions = response.data
    })

    this.getDicts('read_state').then((response) => {
      this.readStateOptions = response.data
    })
    this.getDicts('task_state').then((response) => {
      this.taskStateOptions = response.data
    })
    this.getDicts('task_level').then((response) => {
      this.taskLevelOptions = response.data
    })
  },
  methods: {


    getReadStateTag(row) {
      if (row.readState == 1) {
        return 'danger';
      } else if (row.infoType == 2) {
        return 'success';
      }
    },

    getTagInfoType(row) {
      if (row.infoType == 1) {
        return '';
      } else if (row.infoType == 2) {
        return 'warning';
      } else if (row.infoType == 3) {
        return 'warning';
      } else if (row.infoType == 4) {
        return 'success';
      } else if (row.infoType == 5) {
        return 'danger';
      }
    },


    getTagType(row) {
      if (row.taskType == 1) {
        return '';
      } else if (row.taskType == 2) {
        return 'warning';
      } else if (row.taskType == 3) {
        return 'success';
      }
    },

    getTaskTypeIcon(row) {
      if (row.taskType == 1) {
        return 'dbrw';
      } else if (row.taskType == 2) {
        return 'zdrw';
      } else if (row.taskType == 3) {
        return 'yryb';
      }
    },

    taskTypeFormat(row) {
      return this.selectDictLabel(this.taskTypeOptions, row.taskType);
    },
    readStateFormat(row) {
      return this.selectDictLabel(this.readStateOptions, row.readState);
    },

    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.getList()
    },
    //消息统计
    init() {
      infoChart(this.queryForm).then(response => {
        this.chartVo = response.data;
      });
    },
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
      this.init();
    },
    //重置按钮操作
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //新增按钮操作
    handleAdd() {

    },
    handleView(row) {
      this.$refs['refView'].showPageView(row)
    },
    //查看详情
    handleTaskView(row) {
      this.$refs['refTaskView'].showPageView(row.taskId, this.taskTypeOptions, this.taskStateOptions, this.taskLevelOptions)
    },
    //删除按钮操作
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除消息编号为"' + ids + '"的数据项？').then(function () {
        return delInfo(ids);
      }).then(() => {
        this.getList();
        this.init();
        this.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
  }
};
</script>

