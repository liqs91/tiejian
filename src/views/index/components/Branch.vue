<template>
  <div class="branch">
    <el-card class="branch-card" shadow="hover">
      <template #header>
        <span>
          <vab-icon icon="donut-chart-fill" />
          西安市交易称使用分布
        </span>
      </template>
      <vab-chart
        class="branch-echart"
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
      return {
        initOptions: {
          renderer: 'svg',
        },
        option: {
          tooltip: {
            trigger: 'item',
          },
          series: [
            {
              name: '使用数量',
              type: 'pie',
              radius: ['50%', '70%'],
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
              },
              emphasis: {
                label: {
                  show: true,
                },
              },
              data: [
                { value: 1048, name: '碑林区' },
                { value: 735, name: '莲湖区' },
                { value: 580, name: '灞桥区' },
                { value: 484, name: '雁塔区' },
                { value: 300, name: '长安区' },
              ],
            },
          ],
        },
      }
    },
  }
</script>
