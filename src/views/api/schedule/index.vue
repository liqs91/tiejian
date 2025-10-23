<template>
  <div class="book">
    <div class="titleClass">
      <div class="flagInfo">未开始</div>
      <div class="flagBlue">进行中</div>
      <div class="flagWarning">已超时</div>
      <div class="flagRed">已取消</div>
      <div class="flagGreen">已完成</div>
    </div>
    <div class="calendar" id="calendar" v-loading="loading">
      <div class="calendar-title-box">
        <div style="color: #fff; font-size: 25px; text-align: center;line-height: 90px;">
          <i class="el-icon-arrow-left" @click="changeYear(1)"></i>
          {{ form.year }}
          <i class="el-icon-arrow-right" @click="changeYear(2)"></i>
        </div>
        <div>
          <div class="calMonth" v-for="item in monthList" :key="item">
            <div :class="item==form.month?'calMC':'calMA'" @click="changeMonth(item)">
              <div :class="item==form.month?'calMD':'calMB'">
                <p>{{ item }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="calendar-body-box">
        <table id="calendarTable" class="calendar-table">
          <tbody>
          <tr class="calendar-table-th">
            <th>日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th>六</th>
          </tr>
          <tr v-for="i in 6" class="calendar-main-th" :key="i">
            <td class="currentMonth" v-for="j in 7" :key="j">
              <div class="calendar-num">{{ gainDay((i - 1) * 7 + j) }}</div>
              <div class="calendar-route">
                <a v-for="(task,index) in taskMap[(i-1)*7+j-week]" :key="index"
                   :class="getStateStyle(task)">
                  <el-popover
                    placement="top-start"
                    trigger="hover">
                    <div :class="getContStateStyle(task)">
                      <div class="popTitle">
                      </div>

                      <div class="popCont">
                        <p>
                          <vab-icon icon="task-line"/>
                          任务名称：<span class="num">{{ task.taskName }}</span>
                        </p>

                        <p>
                          <vab-icon icon="user-star-line"/>
                          联系人：<span class="num">{{ task.taskLxr }}</span>
                        </p>
                        <p>
                          <vab-icon icon="cellphone-line"/>
                          联系电话：<span class="num">{{ task.taskLxdh }}</span>
                        </p>
                        <p>
                          <vab-icon icon="calendar-2-line"/>
                          任务期限：<span class="num">{{ task.taskDate }}</span>
                        </p>
                        <p>
                          <vab-icon icon="sort-asc"/>
                          优先级：
                          <el-tag effect="dark" :type="getLevelTagType(task)">
                            {{ taskLevelFormat(task) }}
                          </el-tag>
                        </p>
                        <p>
                          <vab-icon icon="dashboard-line"/>
                          任务类型：
                          <el-tag :type="getTagType(task)">
                            <vab-icon :icon="getTaskTypeIcon(task)" is-custom-svg/>
                            {{ taskTypeFormat(task) }}
                          </el-tag>
                        </p>
                      </div>
                    </div>
                    <span slot="reference" type="text" @click="handleView(task)">{{
                        index + 1 + "-" + task.taskName
                      }}</span>
                  </el-popover>
                </a>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <page-view ref="refView" @submit="bookingSearch" :key="Math.random()"/>
  </div>

</template>
<script>

import {getScheduleData} from "@/api/service/schedule";
import pageView from "@/views/api/task/components/pageView.vue";

export default {
  components: {pageView},
  data() {
    let date = new Date()
    return {
      loading: false,
      week: 0,
      days: 31,
      monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      taskStateOptions: [],
      taskTypeOptions: [],
      taskLevelOptions: [],
      form: {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      },
      taskMap: {},
    }
  },
  created() {
    this.getDicts('task_type').then((response) => {
      this.taskTypeOptions = response.data
    })
    this.getDicts('task_state').then((response) => {
      this.taskStateOptions = response.data
    })
    this.getDicts('task_level').then((response) => {
      this.taskLevelOptions = response.data
    })
  },
  mounted: function () {
    this.bookingSearch()
  },
  methods: {

    //查看详情
    handleView(row) {
      this.$refs['refView'].showPageView(row.id, this.taskTypeOptions, this.taskStateOptions, this.taskLevelOptions)
    },

    getStateStyle(row) {
      if (row.taskState == 1) {
        return 'calendarInfo';
      } else if (row.taskState == 2) {
        return 'calendarBlue';
      } else if (row.taskState == 3) {
        return 'calendarWarning';
      } else if (row.taskState == 4) {
        return 'calendarRed';
      } else if (row.taskState == 5) {
        return 'calendarSuccess';
      }
    },

    getContStateStyle(row) {
      if (row.taskState == 1) {
        return 'contInfo';
      } else if (row.taskState == 2) {
        return 'contBlue';
      } else if (row.taskState == 3) {
        return 'contWarning';
      } else if (row.taskState == 4) {
        return 'contRed';
      } else if (row.taskState == 5) {
        return 'contSuccess';
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


    taskTypeFormat(row) {
      return this.selectDictLabel(this.taskTypeOptions, row.taskType);
    },

    taskLevelFormat(row) {
      return this.selectDictLabel(this.taskLevelOptions, row.taskLevel);
    },


    changeMonth(item) {
      this.form.month = item
      this.bookingSearch()
    },
    changeYear(type) {
      if (type == '1') {
        this.form.year -= 1
        this.bookingSearch()
      }
      if (type == '2') {
        this.form.year += 1
        this.bookingSearch()
      }
    },
    gainDay(index) {
      return index - this.week <= 0 ? '' : ((index - this.week) > this.days ? '' : index - this.week)
    },
    bookingSearch() {
      this.loading = true
      getScheduleData(this.form).then(res => {
        if (res.code == 200) {
          this.week = res.data.week
          this.days = res.data.days
          this.taskMap = res.data.taskMap
        }
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import 'book.scss';
</style>

