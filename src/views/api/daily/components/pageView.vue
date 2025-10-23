<template>
  <el-drawer :title="title" :visible.sync="dialogFormVisible" custom-class="demo-drawer" @close="close" size="100%">
    <div class="xin-main">
      <div class="xin-content">
        <div class="tabTool">
          <span class="title">基本信息</span>
        </div>
        <el-descriptions class="margin-top" :column="2" :size="size" border>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="user-star-line"/>
              提交人
            </template>
            {{ form.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="task-line"/>
              所属任务
            </template>
            {{ form.taskName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="user-3-line"/>
              上报领导
            </template>
            {{ form.leaderNames }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="group-fill"/>
              日报抄送人
            </template>
            {{ form.sendNames }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="calendar-2-line"/>
              日期
            </template>
            {{ form.dailyDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="calendar-line"/>
              提交时间
            </template>
            {{ form.submitTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="file-paper-2-line"/>
              今日未完成工作
            </template>
            <el-input
              v-model="form.dayUncontent"
              readonly
              :rows="6"
              type="textarea"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="file-paper-2-line"/>
              需协调工作
            </template>
            <el-input
              v-model="form.joinContent"
              readonly
              :rows="6"
              type="textarea"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="file-paper-2-line"/>
              今日完成工作
            </template>
            <el-input
              v-model="form.dayContent"
              readonly
              :rows="6"
              type="textarea"
            />
          </el-descriptions-item>

        </el-descriptions>
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
      payMethodOptions: [],
      reverse2: false,
    }
  },
  created() {
    this.getDicts('pay_method').then((response) => {
      this.payMethodOptions = response.data
    })

  },
  methods: {


    taskTypeFormat(row) {
      return this.selectDictLabel(this.taskTypeOptions, row.taskType);
    },


    showPageView(row) {
      this.title = '日报详情'
      this.form = row;
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
