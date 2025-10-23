<template>
  <div class="workbench-container">
    <el-row :gutter="24">
      <el-col>
        <profile/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <warning/>
      </el-col>
      <el-col :span="12">
        <offline/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <alarm/>
      </el-col>
      <el-col :span="12">
        <flow/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import profile from './components/Profile'
import warning from './components/Warning'
import offline from './components/Offline.vue'
import alarm from './components/Alarm.vue'
import flow from './components/Flow.vue'


export default {
  name: 'Workbench',
  components: {
    alarm,
    profile,
    warning,
    offline,
    flow,
  },
}
</script>

<style lang="scss" scoped>
.workbench-container {
  padding: 0 !important;
  background: $base-color-background !important;

}

</style>
