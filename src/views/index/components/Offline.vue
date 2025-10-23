<!--
<template>
  <el-card shadow="hover" class="my-card">
    <template #header>
        <span class="font_size_on">
          <vab-icon icon="phone-fill"/>
          设备离线数据统计
        </span>
    </template>
    <vab-chart
      :init-options="initOptions"
      :option="option"
      theme="vab-echarts-theme"
    />
  </el-card>
</template>

<script>
import VabChart from '@/extra/VabChart'
import {offLineChart} from "@/api/service/chart";

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
      await offLineChart().then(res => {
        if (res.code === 200) {
          this.list = res.data
          this.initOption();
        }
      })
    },

    initOption() {
      this.option = {
        grid: {
          top: '10%',
          left: '2%',
          right: '2%',
          bottom: '4%',
          containLabel: true,
        },
        legend: {
          show: false,
          top: -2,
          right: "10%"
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b} <br/>{a} : {c} (次)'
        },

        xAxis: {
          type: 'category',
          data: this.list.map(i => i.name),
        },
        yAxis: {
          type: 'value',
          name: '数量(次)',
          nameTextStyle: {
            padding: [0, 0, 0, 10]
          }
        },
        series: {
          name: '离线数据',
          itemStyle: {
            normal: {
              color: function (colors) {
                var colorList = [
                  '#FFC300',
                  '#FFC300',
                  '#FFC300',
                  '#FFC300',
                  '#FFC300',
                  '#FFC300',
                  '#FFC300',
                ];
                return colorList[colors.dataIndex];
              }
            },
          },
          label: {
            show: true,
            position: 'top'
          },
          data: this.list.map(i => i.sum),
          type: 'bar',
        },
      }
    },
  },
}
</script>


-->
