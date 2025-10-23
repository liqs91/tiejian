<template>
  <el-card class="task" shadow="hover">
    <template #header>
      <span class="font_size_on">
        <vab-icon icon="task-line"/>
        任务统计
      </span>
      <el-tag class="card-header-tag" type="warning">月</el-tag>
    </template>
    <vab-chart
      :init-options="initOptions"
      :option="option"
      theme="vab-echarts-theme"
    />
    <div class="bottom">
      <span>
        任务总量:
         {{total}}
        <el-tag class="card-footer-tag" type="success">倒计时 {{ n }}s</el-tag>
      </span>
    </div>
  </el-card>
</template>
<script>
import VabChart from '@/extra/VabChart'
import {taskChart} from "@/api/service/chart";

export default {
  components: {
    VabChart,
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
    next()
  },
  created() {
    this.init();

  },
  data() {
    return {
      timer: null,
      n: 3,
      total: 0,
      list: [],
      initOptions: {
        renderer: 'svg',
      },
      option: {},
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.n > 0) {
        this.n--
      } else {
        this.option.series[0].type = _.sample(
          _.pull(['line', 'bar', 'scatter'], [this.option.series[0].type])
        )
        this.n = 3
      }
    }, 1000)
  },

  methods: {
    async init() {
      await taskChart().then(res => {
        if (res.code === 200) {
          this.list = res.data.data
          this.total = res.data.total
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
          top: '5%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.list.map(i => i.name),
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '任务数',
            type: 'bar',
            barWidth: '60%',
            data: this.list.map(i => i.sum),
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
              color: new VabChart.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                ['#88D1FF', '#1890FF'].map((color, offset) => ({
                  color,
                  offset,
                }))
              ),
            },
          },
        ],
      }
    },
  },
}
</script>

