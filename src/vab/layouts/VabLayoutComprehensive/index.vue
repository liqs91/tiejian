<template>
  <!--综合布局 -->
  <div class="vab-layout-comprehensive" :class="{fixed: fixedHeader,'no-tabs-bar': !showTabs,}">
    <div class="vab-main" :class="{'is-collapse-main': collapse,}">
      <div class="vab-layout-header" :class="{'fixed-header': fixedHeader,}">
        <vab-logo style="width: 266px;"/>
        <div class="nav-header">
          <vab-nav layout="comprehensive" />
        </div>
      </div>
      <vab-side-bar layout="comprehensive" />
<!--      <vab-tabs v-show="showTabs" />-->
      <vab-app-main/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VabLayoutComprehensive',
  props: {
    collapse: {
      type: Boolean,
      default() {
        return false
      },
    },
    fixedHeader: {
      type: Boolean,
      default() {
        return true
      },
    },
    showTabs: {
      type: Boolean,
      default() {
        return true
      },
    },
    device: {
      type: String,
      default() {
        return 'desktop'
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.vab-layout-comprehensive {
  .fixed-header {

  }
  .nav-header {
    position: fixed;
    top: 0;
    left: $base-left-menu-width;
    width: $base-right-content-width;
  }
}
</style>
