<!--
<template>
  <el-card shadow="hover" class="my-card">
    <template #header>
         <span class="font_size_on">
          <vab-icon icon="user-star-fill"/>
          诚信计量交易统计
        </span>
    </template>
    <vab-chart
      class="trend-echart"
      :init-options="initOptions"
      :option="option"
      theme="vab-echarts-theme"/>
  </el-card>
</template>
<script>
import VabChart from '@/extra/VabChart'
import {flowChart} from "@/api/service/chart";

export default {
  components: {
    VabChart,
  },
  data() {
    return {
      initOptions: {
        renderer: 'svg',
      },
      option: {},
      list: []
    }
  },

  created() {
    this.init();

  },
  methods: {
    async init() {
      await flowChart().then(res => {
        if (res.code === 200) {
          this.list = res.data
          this.initOption();
        }
      })
    },


    initOption() {
      this.option = {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'z-index:1',
        },
        grid: {
          top: '4%',
          left: '2%',
          right: '2%',
          bottom: '0%',
          containLabel: true,
        },
        legend: {
          show: false,
          top: -2,
          right: "10%"
        },
        xAxis: [
          {
            type: 'category',
            data: this.list.map(i => i.name),
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '数量',
            type: 'line',
            data: this.list.map(i => i.sum),
            symbol: 'circle',
            color: '#74BE8C',
            smooth: true,
            yAxisIndex: 0,
            showSymbol: false,
            lineStyle: {},
            areaStyle: {
              opacity: 0.8,
            },
          },
        ],
      }
    },
  },
}
</script>
<style>

.font_size_on {
  font-size: 16px;
  font-weight: bold;
  color: #0f2027;
}
.my-card .el-card__header {
  background-color: #ebeef5; /* 修改为你想要的颜色 */
  padding: 10px 20px;
  border-bottom: 1px solid lightgray;
}

</style>
-->
