<template>
  <el-drawer :title="title" :visible.sync="dialogFormVisible" custom-class="demo-drawer" @close="close" size="80%">
    <div class="xin-main">
      <div class="xin-content">
        <div class="tabTool">
          <span class="title">基本信息</span>
        </div>
        <el-descriptions class="margin-top" :column="2" border>

          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="message-line"/>
              消息标题
            </template>
            {{ form.infoTitle }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="user-3-line"/>
              接收人
            </template>
            {{ form.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="task-line"/>
              任务名称
            </template>
            {{ form.taskName }}
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
              <vab-icon icon="file-paper-2-line"/>
              消息内容
            </template>
            <el-input
              v-model="form.infoContent"
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
      title: null,
      loading: false,
      dialogFormVisible: false,
      form: {},
      taskTypeOptions: [],
      projectStateOptions: [],
    }
  },
  created() {
    this.getDicts('task_type').then((response) => {
      this.taskTypeOptions = response.data
    })

    this.getDicts('project_state').then((response) => {
      this.projectStateOptions = response.data
    })

  },
  methods: {

    showPageView(row) {
      this.title = '消息详情'
      this.form = row
      this.dialogFormVisible = true
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

    taskTypeFormat(row) {
      return this.selectDictLabel(this.taskTypeOptions, row.taskType);
    },


    close() {
      this.$emit('submit')
      this.dialogFormVisible = false
    },

  },
}
</script>
<style>

.verticalTable {
  width: 100%;
  border: 1.5px solid #ebeef5;
  border-collapse: collapse;
  font-size: 14px;
  margin: 1rem 0px;

  tr td {
    border: 1px solid #ebeef5;
    height: 45px;
    line-height: 45px;
    padding: 0 10px;

    .fjxx-table {
      i {
        padding: 0 20px;
      }
    }
  }

  tr td.column {
    text-align: right;

    .required {
      color: red;
    }
  }

  td.column {
    background: #f5f7fa;
    width: 8%;
  }

  td.column_val {
    background: #ffffff;
    width: 15%;
  }

  .el-form-item {
    margin-bottom: 0;

    ::v-deep {
      .el-input__inner {
        border: none !important;
        background-color: #ffffff !important;
        color: #ebeef5 !important;
      }

      .el-form-item__error {
        top: 50%;
        transform: translateY(-50%);
        right: 0 !important;
        left: auto;
        padding-top: 0;
      }
    }
  }
}


.xin-main {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.xin-content {
  height: 90%;
  overflow-y: scroll;
  box-sizing: border-box;
  overflow-x: hidden;
  margin-top: 15px;
  margin: 15px;
}
</style>
