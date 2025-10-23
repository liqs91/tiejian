<template>
  <el-drawer :title="title" :visible.sync="dialogFormVisible" custom-class="demo-drawer" @close="close" size="80%">
    <div class="xin-main">
      <div class="xin-content">
        <div class="tabTool">
          <span class="title">完成情况</span>
        </div>

        <el-form :model="params" ref="queryForm" size="small" :inline="true"
                 label-width="68px">
          <el-form-item label="年份" prop="year">
            <el-date-picker
              :clearable="false"
              v-model="params.years"
              type="years"
              value-format="yyyy"
              placeholder="请选择年份"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>


        <el-table v-loading="loading" border :data="sheetList" :span-method="objectSpanMethod">
          <el-table-column label="负责人" align="center" prop="userName" width="200"/>
          <el-table-column label="年份" align="center" prop="sheetYear" width="180"/>
          <el-table-column label="序号" align="center" prop="sheetLevel" width="150"/>
          <el-table-column label="任务名称" align="center" prop="taskName"/>
          <el-table-column label="完成状态" align="center" prop="sheetState" width="200">
            <template slot-scope="scope">
              <el-tag :type="getTagType(scope.row)">
                {{ sheetStateFormat(scope.row) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
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


import {findListSheet} from "@/api/service/sheet";

export default {
  name: 'FlowView',
  components: {},
  data() {
    return {
      title: null,
      loading: false,
      dialogFormVisible: false,
      params: {
        years: null,
        userId: null,
      },
      sheetList: [],
      projectStateOptions: [],
    }
  },
  created() {
    this.getDicts('sheet_state').then((response) => {
      this.projectStateOptions = response.data
    })

  },
  methods: {


    // 合并行
    objectSpanMethod({rowIndex, columnIndex}) {
      // 如果是第一行
      if (columnIndex === 0) {
        const _row = this.filterNameSpan(this.sheetList, 'userId')[rowIndex] // 这里需要修改
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 1) {
        const _row = this.filterYearSpan(this.sheetList, 'sheetYear')[rowIndex] // 这里需要修改
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 处理数据
    filterNameSpan(arr, condition) {
      const spanOneArr = []
      let concatOne = 0
      arr.map((item, index) => {
        if (index === 0) {
          spanOneArr.push(1)
        } else {
          // 第一列需合并相同内容的判断条件
          if (item[condition] === arr[index - 1][condition]) {
            spanOneArr[concatOne] += 1
            spanOneArr.push(0)
          } else {
            spanOneArr.push(1)
            concatOne = index
          }
        }
      })
      return spanOneArr
    },
    filterYearSpan(arr, condition) {
      const spanOneArr = []
      let concatOne = 0
      arr.map((item, index) => {
        if (index === 0) {
          spanOneArr.push(1)
        } else {
          // 第一列需合并相同内容的判断条件
          if (item[condition] === arr[index - 1][condition]) {
            spanOneArr[concatOne] += 1
            spanOneArr.push(0)
          } else {
            spanOneArr.push(1)
            concatOne = index
          }
        }
      })
      return spanOneArr
    },


    getTagType(row) {
      if (row.sheetState == 1) {
        return '';
      } else if (row.sheetState == 2) {
        return 'success';
      } else if (row.sheetState == 3) {
        return 'danger';
      }
    },


    sheetStateFormat(row) {
      return this.selectDictLabel(this.projectStateOptions, row.sheetState)
    },

    showPageView(row) {
      this.title = '一人一表'
      this.params.years = [row.sheetYear]
      this.params.userId = row.userId
      findListSheet(this.params).then(response => {
        this.sheetList = response.data
      });
      this.dialogFormVisible = true
    },


    handleQuery() {
      findListSheet(this.params).then(response => {
        this.sheetList = response.data
      });
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
