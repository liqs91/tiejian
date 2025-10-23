<template>
  <div class="index-container">
    <el-row :gutter="20">
      <icon-list/>
      <el-col :lg="6" :md="12" :sm="24" :xl="12" :xs="24">
        <project/>
      </el-col>
      <el-col :lg="6" :md="12" :sm="24" :xl="12" :xs="24">
        <task/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import IconList from './components/IconList'
import Task from "@/views/index/components/Task.vue";
import Project from "@/views/index/components/Project.vue";

export default {
  name: 'Index',
  components: {
    Project,
    Task,
    IconList,
  },
}
</script>

<style lang="scss" scoped>
.index-container {
  padding: 0 !important;
  background: $base-color-background !important;

  :deep() {
    .project,
    .task {
      height: 505px;
      .el-card__header {
        background-color: #ebeef5; /* 修改为你想要的颜色 */
        border-bottom: 1px solid lightgray;
      }
      .font_size_on {
        font-size: 16px;
       }
    }
    span{
      font-size: 18px;
    }
    .el-card {
      .el-card__header {
        position: relative;
        .card-header-tag {
          position: absolute;
          top: 15px;
          right: $base-margin;
        }
        > div > span {
          display: flex;
          align-items: center;
          i {
            margin-right: 3px;
          }
        }
      }
      .el-card__body {
        position: relative;
        .echarts {
          width: 100%;
          height: 350px;
        }
        .card-footer-tag {
          position: absolute;
          right: $base-margin;
          bottom: 15px;
        }
      }
    }
    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
     // border-top: 1px solid $base-border-color;
    }
  }
}
</style>
