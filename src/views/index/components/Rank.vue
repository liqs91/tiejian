<template>
  <div class="rank">
    <el-card class="rank-card" shadow="hover">
      <template #header>
        <span>
          <vab-icon icon="align-top"/>
          商户投诉Top10
        </span>
      </template>
      <vab-chart
        class="rank-echart"
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
  components: {VabChart},
  data() {
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
          right: '20%',
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
              '冯超副食部',
              '志奇肉类经销部',
              '添润牛羊肉',
              '倍祥润食品',
              '通惠水产批发部',
              '祝运水产',
              '金芳果品炒货行',
              '海淘云仓水产',
              '家家鲜海鲜冻货商行',
              '徐记熟食批发',
            ],
          },
        ],
        series: [
          {
            name: '累计投诉',
            type: 'bar',
            barWidth: 15,
            label: {
              show: true,
              position: 'right',
              color: '#1890FF',
              fontSize: 12,
              formatter: ({data}) => {
                return `${data}个`
              },
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            data: [1, 2, 3, 4, 4, 5, 6, 7, 8, 9],
          },
        ],
      },
    }
  },
}
</script>
