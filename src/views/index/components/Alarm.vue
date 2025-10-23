<!--
<template>
  <div>
    <el-card shadow="hover" class="my-card">
      <template #header>
        <span class="font_size_on">
          <vab-icon icon="volume-up-fill"/>
          监管报警趋势统计
        </span>
      </template>
      <vab-chart
        class="trend-echart"
        :init-options="initOptions"
        :option="option"
        theme="vab-echarts-theme"
      />
    </el-card>
  </div>
</template>

<script>
import VabChart from '@/extra/VabChart'
import {alarmChart} from "@/api/service/chart";

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
      await alarmChart().then(res => {
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
            color: '#4487FF',
            data: this.list.map(i => i.sum),
            symbol: 'circle',
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
.echarts {
  width: auto;
  height: 280px;
}


</style>
-->
