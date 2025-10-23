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
              <vab-icon icon="stack-line"/>
              项目名称
            </template>
            {{ form.projectName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="user-3-line"/>
              项目负责人
            </template>
            {{ form.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="user-star-line"/>
              联系人
            </template>
            {{ form.projectLxr }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="cellphone-line"/>
              联系电话
            </template>
            {{ form.projectLxdh }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="calendar-2-line"/>
              完成期限
            </template>
            {{ form.projectDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="battery-2-charge-line"/>
              项目状态
            </template>
            <el-tag :type="getTagType(form)">
              {{ projectStateTableFormat(form.projectState) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="alarm-line"/>
              开始时间
            </template>
            {{ form.startTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="alarm-fill"/>
              结束时间
            </template>
            {{ form.endTime }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="file-text-line"/>
              项目进度
            </template>
            <el-progress :text-inside="true" :stroke-width="15"
                         :percentage="form.projectBar>100?100:form.projectBar"
                         :color="handleProgress(form)"/>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <vab-icon icon="file-paper-2-line"/>
              项目内容
            </template>
            <el-input
                v-model="form.projectContent"
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
      projectStateOptions: [],
    }
  },
  created() {
    this.getDicts('project_state').then((response) => {
      this.projectStateOptions = response.data
    })

  },
  methods: {

    getTagType(row) {
      if (row.projectState == 1) {
        return '';
      } else if (row.projectState == 2) {
        return 'danger';
      } else if (row.projectState == 3) {
        return 'success';
      }
    },

    handleProgress(row) {
      if (row.projectBar < 30) {
        return '#f56c6c';
      } else if (row.projectBar < 60) {
        return '#e6a23c';
      } else if (row.projectBar < 90) {
        return '#409eff';
      } else if (row.projectBar > 99) {
        return '#67C23A';
      }
    },

    projectStateTableFormat(val) {
      return this.selectDictLabel(this.projectStateOptions, val)
    },


    showPageView(row) {
      this.title = '项目详情'
      this.form = row
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
