<!--
<template>

  <el-card shadow="hover" class="my-card">
    <template #header>
        <span class="font_size_on">
          <vab-icon icon="alarm-warning-fill"/>
          待处理预警
        </span>
    </template>

    <el-table border v-loading="loading" :data="alarmList" :max-height="250">
      <el-table-column label="报警记录编号" align="center" prop="alarmNo" fixed="left" width="250">
        <template slot-scope="scope">
          <el-tag size="medium" type="info">
            <vab-icon icon="barcode-fill"/>
            {{ scope.row.alarmNo }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="计量设备编号" align="center" prop="deviceCode" width="130">
        <template slot-scope="scope">
          <el-tag size="medium">
            <vab-icon icon="scales-2-line"/>
            {{ scope.row.deviceCode }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="报警类型" align="center" prop="alarmType" width="170">
        <template slot-scope="scope">
          <el-tag type="danger">
            <vab-icon icon="alarm-warning-fill"/>
            {{ alarmTypeFormat(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" align="center" prop="alarmTime" width="180">
        <template slot-scope="scope">
          <el-tag type="danger">
            <vab-icon icon="time-line"/>
            {{ scope.row.alarmTime }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" @click="handleView(scope.row)">处理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

</template>

<script>

import {listAlarm} from "@/api/service/alarm";

export default {
  name: 'Warning',
  data() {
    return {
      loading: false,
      alarmList: [],
      alarmTypeOptions: [],
      handleResultOptions: [],
      total: 0,
      layout: 'total, sizes, prev, pager, next, jumper',
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 100,
        marketName: null,
        merchantName: null,
        deviceCode: null,
        moduleNo: null,
        areaId: null,
      },
    }
  },
  created() {
    this.getDicts('error_type').then((response) => {
      this.alarmTypeOptions = response.data
    })
    this.getDicts('handle_type').then((response) => {
      this.handleResultOptions = response.data
    })

    this.getList();
  },

  methods: {

    handleView(row) {
      this.$router.push({name: 'Alarm', params: {"alarmNo": row.alarmNo}});
    },
    alarmTypeFormat(row) {
      return this.selectDictLabel(this.alarmTypeOptions, row.alarmType);
    },
    handleResultFormat(row) {
      return this.selectDictLabel(this.handleResultOptions, row.handleResult);
    },


    //查询模块管理列表
    getList() {
      this.loading = true;
      listAlarm(this.queryForm).then(response => {
        this.alarmList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    //导出按钮操作
    handleExport() {

    }
  }
}
</script>


<style>

.el-card {
  height: 360px;

  [class*='-echart'] {
    width: 100%;
    height: 200px;
  }
}

</style>
-->
