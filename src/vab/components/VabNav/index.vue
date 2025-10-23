<template>
  <div class="vab-nav">
    <el-row :gutter="15">
      <el-col :lg="14" :md="14" :sm="14" :xl="14" :xs="4">
        <div class="left-panel">
          <vab-fold v-if="firstMenu != 'Root'&&firstMenu != 'Task'&&firstMenu != 'Project'&&
          firstMenu != 'Sheet'&&firstMenu != 'Schedule'&&firstMenu != 'Message'&&firstMenu != 'Daily'"/>
          <el-tabs
            v-if="layout === 'comprehensive'"
            v-model="extra.first"
            tab-position="top"
            @tab-click="handleTabClick"
          >
            <template v-for="(route, index) in handleRoutes">
              <el-tab-pane :key="index + route.name" :name="route.name">
                <span slot="label">
                  <vab-icon
                    v-if="route.meta.icon"
                    :icon="route.meta.icon"
                    :is-custom-svg="route.meta.isCustomSvg"
                    style="min-width: 16px"
                  />
                  {{ translateTitle(route.meta.title) }}
                </span>
              </el-tab-pane>
            </template>
          </el-tabs>
          <vab-breadcrumb v-else class="hidden-xs-only"/>
        </div>
      </el-col>
      <el-col :lg="10" :md="10" :sm="10" :xl="10" :xs="20">
        <div class="right-panel">
          <!--          <vab-error-log/>-->
          <vab-search/>
          <vab-notice/>
          <vab-full-screen/>
          <vab-language/>
          <vab-theme/>
          <vab-refresh/>
          <vab-avatar/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {translateTitle} from '@/utils/i18n'
import {mapActions, mapGetters} from 'vuex'
import {openFirstMenu} from '@/config'

export default {
  name: 'VabNav',
  props: {
    layout: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      firstMenu: '',
    }
  },
  computed: {
    ...mapGetters({
      extra: 'settings/extra',
      routes: 'routes/routes',
    }),
    handleRoutes() {
      return this.routes.filter(
        (route) => route.meta && route.meta.hidden !== true
      )
    },
    handleActiveMenu() {
      return this.routes.find((route) => route.name === this.extra.first)
    },
    handlePartialRoutes() {
      const activeMenu = this.handleActiveMenu
      return activeMenu ? activeMenu.children : []
    },
  },
  watch: {
    $route: {
      handler(route) {
        const firstMenu = route.matched[0].name
        this.firstMenu = route.matched[0].name
        if (firstMenu === "Root" && this.$store.state.settings.collapse == false) {
          this.toggleCollapse()
        }
        if (this.extra.first !== firstMenu) {
          this.extra.first = firstMenu
          this.handleTabClick(true)
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      toggleCollapse: 'settings/toggleCollapse',
    }),
    translateTitle,
    handleTabClick(handler) {
      // alert(this.firstMenu)
      if (handler !== true && openFirstMenu) {
        if (this.handleActiveMenu.children && this.handleActiveMenu.children.length > 1) {
          if (this.$store.state.settings.collapse == true) {
            this.toggleCollapse()
          }
        } else {
          if (this.handleActiveMenu.children && this.$store.state.settings.collapse == false) {
            this.toggleCollapse()
          }
        }
        const {redirect} = this.handleActiveMenu
        this.$router.push(redirect ? redirect : this.handleActiveMenu)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.vab-nav {
  position: relative;
  height: $base-nav-height;
  padding-right: $base-padding;
  padding-left: $base-padding;
  overflow: hidden;
  user-select: none;
  background: $base-color-white;
  box-shadow: $base-box-shadow;

  .left-panel {
    display: flex;
    align-items: center;
    justify-items: center;
    height: $base-nav-height;

    ::v-deep {
      .fold-unfold {
        margin-right: $base-margin;
      }

      .el-tabs {
        width: 100%;
        margin-left: $base-margin;

        .el-tabs__header {
          margin: 0;

          > .el-tabs__nav-wrap {
            display: flex;
            align-items: center;

            .el-icon-arrow-left,
            .el-icon-arrow-right {
              font-weight: 600;
              color: $base-color-grey;
            }
          }
        }

        .el-tabs__item {
          text-align: center;

          > div {
            display: flex;
            align-items: center;

            i {
              margin-right: 3px;
            }
          }
        }
      }

      .el-tabs__nav-wrap::after {
        display: none;
      }
    }
  }

  .right-panel {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: flex-end;
    height: $base-nav-height;

    ::v-deep {
      [class*='ri-'] {
        margin-left: $base-margin;
        color: $base-color-grey;
        cursor: pointer;
      }

      button {
        [class*='ri-'] {
          margin-left: 0;
          color: $base-color-white;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
