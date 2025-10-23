<template>
  <el-drawer :title="title" :visible.sync="dialogFormVisible" custom-class="demo-drawer" @close="close" size="100%">
    <div class="xin-main">
      <div class="xin-content">
        <el-row>
          <!--用户数据-->
          <el-col :span="18" :xs="24">
            <div class="tabTool">
              <span class="title">基本信息</span>
            </div>
            <el-descriptions class="margin-top" :column="2" :size="size" border>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="task-line"/>
                  任务名称
                </template>
                {{ form.taskName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="stack-line"/>
                  所属项目
                </template>
                {{ form.projectName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="sort-asc"/>
                  优先级
                </template>
                <el-tag effect="dark" :type="getLevelTagType(form)">
                  {{ taskLevelFormat(form) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="dashboard-line"/>
                  任务类型
                </template>
                <el-tag :type="getTagType(form)">
                  <vab-icon :icon="form.taskType ==1 ? 'dbrw' :  form.taskType  == 2 ? 'zdrw' : 'yryb'" is-custom-svg/>
                  {{ taskTypeFormat(form) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="user-3-line"/>
                  任务负责人
                </template>
                {{ form.userName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="user-star-line"/>
                  联系人
                </template>
                {{ form.taskLxr }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="cellphone-line"/>
                  联系电话
                </template>
                {{ form.taskLxdh }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="calendar-2-line"/>
                  完成期限
                </template>
                {{ form.taskDate }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="group-line"/>
                  任务协作人
                </template>
                {{ form.helpNames }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="group-fill"/>
                  任务抄送人
                </template>
                {{ form.sendNames }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="battery-2-charge-line"/>
                  任务状态
                </template>
                <el-tag :type="getStateTagType(form)">
                  {{ taskStateFormat(form) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="riding-line"/>
                  任务进度
                </template>
                <el-progress :text-inside="true" :stroke-width="15"
                             :percentage="form.taskBar>100?100:form.taskBar"
                             :color="handleProgress(form)"/>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  <vab-icon icon="file-paper-2-line"/>
                  任务内容
                </template>
                <el-input
                    v-model="form.taskContent"
                    readonly
                    :rows="6"
                    type="textarea"
                />
              </el-descriptions-item>
            </el-descriptions>
            <br>
            <div class="tabTool">
              <span class="title">跟进信息</span>
            </div>
            <el-table border v-loading="loading" :data="form.taskFollowList">
              <el-table-column label="跟进人" align="center" prop="followName" width="130"/>
              <el-table-column label="任务状态" align="center" prop="taskState" width="130">
                <template slot-scope="scope">
                  <el-tag :type="getStateTagType(scope.row)">
                    {{ taskStateFormat(scope.row) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="任务进度" align="center" prop="taskBar" width="170">
                <template slot-scope="scope">
                  <el-progress :text-inside="true" :stroke-width="15"
                               :percentage="scope.row.taskBar>100?100:scope.row.taskBar"
                               :color="handleProgress(scope.row)"/>
                </template>
              </el-table-column>

              <el-table-column label="跟进描述" align="center" prop="followContent"/>
              <el-table-column label="汇报时间" align="center" prop="followTime" width="180"/>
              <template #empty>
                <el-image
                    class="vab-data-empty"
                    :src="require('@/assets/empty_images/data_empty.png')"
                />
              </template>
            </el-table>
            <br>
            <div class="tabTool">
              <span class="title">评价信息</span>
            </div>
            <el-table border v-loading="loading" :data="form.taskJudgeList">
              <el-table-column label="评价人" align="center" prop="judgeName" width="130"/>
              <el-table-column label="任务进度" align="center" prop="taskBar" width="170">
                <template slot-scope="scope">
                  <el-progress :text-inside="true" :stroke-width="15"
                               :percentage="scope.row.taskBar>100?100:scope.row.taskBar"
                               :color="handleProgress(scope.row)"/>
                </template>
              </el-table-column>

              <el-table-column label="评价内容" align="center" prop="judgeContent"/>
              <el-table-column label="评价时间" align="center" prop="judgeTime" width="180"/>
              <template #empty>
                <el-image
                    class="vab-data-empty"
                    :src="require('@/assets/empty_images/data_empty.png')"
                />
              </template>
            </el-table>

            <br>
          </el-col>

          <el-col :span="6" :xs="24">
            <div class="tabTool">
              <span class="title">任务动态</span>
            </div>
            <div class="timeline-container"  v-if="form.taskLogList!=null">
              <el-timeline :reverse="reverse2">
                <el-timeline-item
                  placement="top"
                  v-for="(item, index) in form.taskLogList"
                  :key="index"

                  :timestamp="item.logTime"
                >
                  <template #dot>
                    <span
                      v-if="index==0"
                      class="vab-dot"
                      :class="{
                    ['vab-dot-blue']: true,
                  }"
                    >
                  <span></span>
                </span>
                  </template>
                  <div
                    class="vab-info-card"
                    :class="{ ['vab-info-card-success ']: true }"
                  >
                    {{ item.logContent }}
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>

            <el-image v-else class="vab-data-empty" :src="require('@/assets/empty_images/data_empty.png')"/>
          </el-col>
        </el-row>
      </div>
      <div class="el-drawer__footer">
        <el-button type="primary" @click="close"
                   :style="{padding: '8px 30px', fontSize: '14px', borderRadius: '4px',textAlign:'center'}">
          关闭
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>

import {getTask} from "@/api/service/task";

export default {
  name: 'FlowView',
  components: {},
  data() {
    return {
      title: '',
      size: '',
      reverse: true,
      loading: false,
      dialogFormVisible: false,
      // 查询参数
      queryForm: {
        billId: null,
      },
      form: {},
      taskTypeOptions: [],
      taskStateOptions: [],
      taskLevelOptions: [],
      reverse2: false,
    }
  },
  created() {
    this.getDicts('pay_method').then((response) => {
      this.payMethodOptions = response.data
    })

  },
  methods: {


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


    showPageView(taskId, taskTypeOptions, taskStateOptions, taskLevelOptions) {
      this.title = '任务详情'
      this.taskTypeOptions = taskTypeOptions,
          this.taskStateOptions = taskStateOptions,
          this.taskLevelOptions = taskLevelOptions
      getTask(taskId).then(response => {
        this.form =  response.data;
      });
      this.dialogFormVisible = true
    },


    close() {
      this.$emit('submit')
      this.dialogFormVisible = false
    },

  },
}
</script>
<style>

.xin-main {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.xin-content {
  height: 95%;
  overflow-y: scroll;
  box-sizing: border-box;
  overflow-x: hidden;
  margin-top: 15px;
  margin: 15px;
}

</style>
<style lang="scss" scoped>
.timeline-container {
  padding: 0 !important;


  ::v-deep {
    .el-timeline-item__dot {
      [class*='ri'] {
        width: 12px;
        height: 12px;
        margin-left: -3px;
        background: $base-color-white;
      }

      .vab-dot {
        left: -1px;
        width: 12px;
        height: 12px;
        margin: auto !important;
      }
    }

    .el-card {
      .el-card__header {
        position: relative;

        .card-header-radio {
          position: absolute;
          top: 20px;
          right: $base-margin;
        }
      }
    }
  }

  .vab-info-card {
    position: relative;
    width: 80%;
    padding: $base-padding;
    background: #e2e2e2;
    border-radius: $base-border-radius + 2;

    &:after {
      position: absolute;
      top: 8px;
      left: -10px;
      width: 0;
      height: 0;
      overflow: hidden;
      content: '';
      border-color: #e2e2e2 transparent transparent;
      border-style: solid dashed dashed;
      border-width: 10px;
    }

    &-success {
      color: $base-color-white;
      background: #998aff;

      &:after {
        border-color: #998aff transparent transparent;
      }
    }

    &-error {
      color: $base-color-white;
      background: $base-color-red;

      &:after {
        border-color: $base-color-red transparent transparent;
      }
    }

    &-warning {
      color: $base-color-white;
      background: $base-color-orange;

      &:after {
        border-color: $base-color-orange transparent transparent;
      }
    }
  }
}
</style>
