<template>
  <div class="target">
    <el-card   shadow="hover">
      <template #header>
        <span>
          <vab-icon icon="money-cny-box-line" />
          设备报警统计
        </span>
      </template>
      <vab-chart
        class="target-echart2"
        :init-options="initOptions"
        :option="option2"
        theme="vab-echarts-theme"
      />
    </el-card>

    <el-card class="target-card1" shadow="hover">
      <template #header>
        <vab-icon icon="body-scan-line" />
        当月市场交易量排名
      </template>
      <vab-chart
        class="target-echart1"
        :init-options="initOptions"
        :option="option"
        theme="vab-echarts-theme"
      />
    </el-card>
  </div>
</template>

<script>
  import VabChart from '@/extra/VabChart'

  export default {
    components: {
      VabChart,
    },
    data() {
      const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
      return {
        initOptions: {
          renderer: 'svg',
        },
        option: {
          tooltip: {
            trigger: 'axis',
            extraCssText: 'z-index:1',
          },
          grid: {
            top: '0%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              splitLine: {
                show: false,
              },
              type: 'value',
              show: false,
            },
          ],
          yAxis: [
            {
              splitLine: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              type: 'category',
              axisTick: {
                show: false,
              },
              data: [
                '鹿塬街综合批发市场',
                '紫葵易购生鲜电商创业园',
                '方欣炭市街副食品市场',
                '鑫朱雀农贸批发市场',
                '世家集市农贸市场',
                '官厅新村和谐市场',
               ],
            },
          ],
          series: [
            {
              name: '交易量',
              type: 'bar',
              barWidth: 25,
              label: {
                show: true,
                position: 'right',
                color: '#1890FF',
                fontSize: 14,
                formatter: ({ data }) => {
                  return `${data}个`
                },
              },
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
              data: [20,32,41,50,74,90]
            },
          ],
        },
        option2: {
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
          xAxis: [
            {
              type: 'category',
              data: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月',
              ],

            },
          ],
          yAxis: [
            {
              type: 'value',
              axisTick: {
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#DCE2E8',
                },
              },
              axisLabel: {
                color: '#556677',
              },
              splitLine: {
                show: false,
              },
            },
          ],


          series: [
            {
              name: '报警数量',
              type: 'bar',
              data: [
                19, 12, 33, 12, 43, 14, 30, 12, 15, 20, 19,
                11,
              ],
              symbolSize: 1,
              symbol: 'circle',
              smooth: true,
              yAxisIndex: 0,
              showSymbol: false,
              lineStyle: {
                width: 5,
                color: new VabChart.graphic.LinearGradient(1, 1, 0, 0, [
                  {
                    offset: 0,
                    color: '#73DD39',
                  },
                  {
                    offset: 1,
                    color: '#73DDFF',
                  },
                ]),
                shadowColor: 'rgba(115,221,255, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20,
              },
              itemStyle: {
                color: colorList[1],
                borderColor: colorList[1],
              },
            },
          ],
        },
      }
    },
  }
</script>

<style lang="scss" scoped>
  .target {
    margin-bottom: $base-margin;
  }

  :deep() {
    .target-echart1 {
      width: 100%;
      height: 290px;
    }

    .target-echart2 {
      width: 100%;
      height: 300px;
    }
  }
</style>
