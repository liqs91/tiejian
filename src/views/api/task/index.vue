<template>
  <div class="app-container">
    <el-form :model="queryForm" ref="queryForm" size="small" :inline="true" v-show="showSearch">

      <el-form-item label="" prop="type">
        <el-select v-model="queryForm.type" placeholder="我的任务">
          <el-option v-for="dict in myTaskOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="projectName">
        <el-input
          v-model="queryForm.projectName"
          placeholder="项目名称"
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
      <el-form-item label="" prop="userName">
        <el-input
          v-model="queryForm.userName"
          placeholder="任务负责人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="taskDate">
        <el-date-picker clearable
                        v-model="queryForm.taskDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="完成期限"/>
      </el-form-item>
      <el-form-item label="" prop="taskLevel">
        <el-input
          v-model="queryForm.taskLevel"
          placeholder="优先级"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button v-hasPermi="['api:task:export']" size="mini" plain icon="el-icon-download" type="warning"
                   @click="handleExport">
          导出
        </el-button>
      </el-form-item>
    </el-form>

    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="卡片" name="first">
        <el-row :gutter="20">
          <el-col v-for="item in taskList" :key="item.id" :span="4">
            <el-card class="task-item" shadow="hover">
              <template #header>
                <span style="font-weight: bold;width: 85%;float: left">
                  【 {{ item.userName }} 】
                  {{ item.taskName }}</span>
                <el-tag style="float: right" class="card-header-tag" :type="getStateTagType(item)">
                  {{ taskStateFormat(item) }}
                </el-tag>
              </template>

              <span :class="getTaskItemImage(item.taskType)" @click="handleView(item)"/>
              <div class="task-item-bottom">
                <el-button size="mini" icon="el-icon-view" type="text" @click="handleView(item)">查看</el-button>
                <el-button size="mini" icon="el-icon-delete" type="text" @click="handleDelete(item)">删除</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="列表" name="second">
        <el-table border v-loading="loading" :data="taskList">
          <el-table-column align="center" label="序号" width="70" type="index" fixed="left">
            <template slot-scope="scope">
              {{ queryForm.pageSize * (queryForm.pageNo - 1) + (scope.$index + 1) }}
            </template>
          </el-table-column>
          <el-table-column label="任务名称" align="center" prop="taskName" width="260"   show-overflow-tooltip>
            <template slot-scope="scope">
                    <span style="color: #1e8bf1;cursor: pointer;" @click="handleView(scope.row)">
                     {{ scope.row.taskName }}
                    </span>
            </template>
          </el-table-column>
          <el-table-column label="所属项目" align="center" prop="projectName" show-overflow-tooltip  />
          <el-table-column label="任务负责人" align="center" prop="userName" width="100"/>
          <el-table-column label="完成期限" align="center" prop="taskDate" width="100"/>
          <el-table-column label="任务类型" align="center" prop="taskType" width="120">
            <template slot-scope="scope">
              <el-tag :type="getTagType(scope.row)">
                <vab-icon :icon="getTaskTypeIcon(scope.row)" is-custom-svg/>
                {{ taskTypeFormat(scope.row) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="优先级" align="center" prop="taskLevel" width="100">
            <template slot-scope="scope">
              <el-tag effect="dark" :type="getLevelTagType(scope.row)">
                {{ taskLevelFormat(scope.row) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="联系人" align="center" prop="taskLxr" width="100"/>
          <el-table-column label="联系电话" align="center" prop="taskLxdh" width="110"/>
          <el-table-column label="任务状态" align="center" prop="taskState" width="100">
            <template slot-scope="scope">
              <el-tag :type="getStateTagType(scope.row)">
                {{ taskStateFormat(scope.row) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="任务进度" align="center" prop="taskBar"  >
            <template slot-scope="scope">
              <el-progress :text-inside="true" :stroke-width="15"
                           :percentage="scope.row.taskBar>100?100:scope.row.taskBar"
                           :color="handleProgress(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column label="创建人" align="center" prop="createName" width="100"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180"/>
          <el-table-column label="操作" align="center" fixed="right" width="180">
            <template slot-scope="scope">
              <!--              <el-button size="mini" type="even" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                                       v-hasPermi="['api:task:edit']">修改
                            </el-button>-->
              <el-button size="mini" type="report" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"
                         v-hasPermi="['api:task:remove']">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-pagination
        background
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"/>
    </el-tabs>
    <page-view ref="refView" @submit="getList" :key="Math.random()"/>
  </div>
</template>

<script>
import {delTask, listTask} from "@/api/service/task";
import pageView from "@/views/api/task/components/pageView.vue";


export default {
  name: "Task",
  components: {pageView},

  data() {
    return {
      // 遮罩层
      loading: true,
      activeName: "first",
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 任务表格数据
      taskList: [],
      myTaskOptions: [],

      layout: 'total, sizes, prev, pager, next, jumper',
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        type: "1",
        projectId: null,
        projectName: null,
        taskName: null,
        taskContent: null,
        userId: null,
        userName: null,
        helpIds: null,
        helpNames: null,
        sendIds: null,
        sendNames: null,
        taskDate: null,
        taskType: null,
        taskLevel: null,
        taskLxr: null,
        taskLxdh: null,
        taskState: null,
        taskBar: null,
        draftState: null,
        status: null,
        createName: null,
        updateName: null,
      },
      taskTypeOptions: [],
      taskStateOptions: [],
      taskLevelOptions: [],

    };
  },
  created() {
    const type = this.$route.query.type
    if (type) {
      this.queryForm.type = type
    }
    this.getDicts('task_type').then((response) => {
      this.taskTypeOptions = response.data
    })
    this.getDicts('my_task').then((response) => {
      this.myTaskOptions = response.data
    })
    this.getDicts('task_state').then((response) => {
      this.taskStateOptions = response.data
    })
    this.getDicts('task_level').then((response) => {
      this.taskLevelOptions = response.data
    })
    this.getList();
  },
  methods: {

    getTaskItemImage(val) {
      if (val == 1) {
        return 'task-item-image-1';
      } else if (val == 2) {
        return 'task-item-image-2';
      } else if (val == 3) {
        return 'task-item-image-3';
      }
    },

    getStateTagType(row) {
      if (row.taskState == 1) {
        return 'info';
      } else if (row.taskState == 2) {
        return '';
      } else if (row.taskState == 3) {
        return 'warning';
      } else if (row.taskState == 4) {
        return 'danger';
      } else if (row.taskState == 5) {
        return 'success';
      }
    },

    getLevelTagType(row) {
      if (row.taskLevel == 1) {
        return 'info';
      } else if (row.taskLevel == 2) {
        return 'success';
      } else if (row.taskLevel == 3) {
        return 'warning';
      } else if (row.taskLevel == 4) {
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

    handleProgress(row) {
      if (row.taskBar < 30) {
        return '#f56c6c';
      } else if (row.taskBar < 60) {
        return '#e6a23c';
      } else if (row.taskBar < 90) {
        return '#409eff';
      } else if (row.taskBar > 99) {
        return '#67C23A';
      }
    },

    taskTypeFormat(row) {
      return this.selectDictLabel(this.taskTypeOptions, row.taskType);
    },
    taskStateFormat(row) {
      return this.selectDictLabel(this.taskStateOptions, row.taskState);
    },
    taskLevelFormat(row) {
      return this.selectDictLabel(this.taskLevelOptions, row.taskLevel);
    },

    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.getList()
    },
    //查询任务列表
    getList() {
      this.loading = true;
      listTask(this.queryForm).then(response => {
        this.taskList = response.rows;
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
      this.reset();
      this.open = true;
      this.title = "添加任务";
    },
    //修改按钮操作
    handleUpdate(row) {

    },

    //查看详情
    handleView(row) {
      this.$refs['refView'].showPageView(row.id, this.taskTypeOptions, this.taskStateOptions, this.taskLevelOptions)
    },


    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除任务编号为"' + ids + '"的数据项？').then(function () {
        return delTask(ids);
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
.app-container {
  .el-col-4 {
    width: 20%;
  }

  background: $base-color-background !important;

  .task-item-image-1:focus,
  .task-item-image-1:hover {
    background: url('~@/assets/index_images/dbrw_click.png') left center no-repeat;

  }

  .task-item-image-1 {
    cursor: pointer;
    width: 130px;
    height: 137px;
    background: url('~@/assets/index_images/dbrw.png') left center no-repeat;

  }

  .task-item-image-2:focus,
  .task-item-image-2:hover {
    background: url('~@/assets/index_images/zdrw_click.png') left center no-repeat;

  }

  .task-item-image-2 {
    cursor: pointer;
    width: 130px;
    height: 137px;
    background: url('~@/assets/index_images/zdrw.png') left center no-repeat;

  }


  .task-item-image-3:focus,
  .task-item-image-3:hover {
    background: url('~@/assets/index_images/yryb_click.png') left center no-repeat;

  }

  .task-item-image-3 {
    cursor: pointer;
    width: 130px;
    height: 137px;
    background: url('~@/assets/index_images/yryb.png') left center no-repeat;

  }

  :deep() {
    .el-card {
      .el-card__header {
        position: relative;
        height: 55px;
        .card-header-tag {
          position: absolute;
          top: 15px;
          right: 10px;
        }

        .card-header-tag-zt {
          position: absolute;
          top: 15px;
          right: 40px;
        }

        > div > span {
          display: flex;
          align-items: center;

          i {
            margin-right: 3px;
          }
        }
      }

      .el-card__body {
        position: relative;

        .card-footer-tag {
          position: absolute;
          right: $base-margin;
          bottom: 20px;
        }
      }
    }
  }

  .task-item {
    min-height: 180px;
    max-height: 270px;

    &-image-1 {
      display: block;
      width: 130px;
      margin: 0 auto 20px;
    }

    &-image-2 {
      display: block;
      width: 130px;
      margin: 0 auto 20px;
    }

    &-image-3 {
      display: block;
      width: 130px;
      margin: 0 auto 20px;
    }

    &-bottom {
      text-align: center;
      border-top: 1px solid #ebeef5;


    }
  }


}
</style>
