<template>
  <el-card class="project" shadow="hover">
    <template #header>
       <span class="font_size_on">
       <vab-icon icon="projector-line"/>
       项目统计
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
        项目总量:
         {{total}}
      </span>
    </div>
  </el-card>
</template>

<script>
import VabChart from '@/extra/VabChart'
import {projectChart} from "@/api/service/chart";

export default {
  components: {VabChart,},
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
    next()
  },
  data() {
    return {
      timer: null,
      total: 0,
      list: [],
      initOptions: {
        renderer: 'svg',
      },
      option: {},
    }
  },


  created() {
    this.init();

  },
  methods: {
    async init() {
      await projectChart().then(res => {
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
            boundaryGap: false,
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
            name: '项目数',
            type: 'line',
            data: this.list.map(i => i.sum),
            smooth: true,
            areaStyle: {},
            itemStyle: {
              borderRadius: [0, 5, 5, 0],
              color: new VabChart.graphic.LinearGradient(
                0,
                0,
                1,
                0,
                ['#3ED572', '#399efd'].map((color, offset) => ({
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

