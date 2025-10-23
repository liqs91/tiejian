<template>
  <el-drawer
    append-to-body
    custom-class="vab-drawer"
    direction="rtl"
    size="280px"
    :title="translateTitle('主题配置')"
    :visible.sync="drawerVisible"
  >
    <el-scrollbar>
      <el-form ref="form" label-position="left" :model="theme">
        <el-form-item>
          <template slot="label">
            {{ translateTitle('布局') }}
            <el-tooltip :content="translateTitle('布局配置仅在电脑视窗下生效，手机视窗时将默认锁定为纵向布局')" effect="dark" placement="top">
              <vab-icon icon="question-line"/>
            </el-tooltip>
          </template>
          <el-select v-model="theme.layout" :disabled="device === 'mobile'" @change="handTheme">
            <el-option
              key="comprehensive"
              :label="translateTitle('综合')"
              value="comprehensive"
            />
            <el-option
              key="common"
              :label="translateTitle('常规')"
              value="common"
            />
            <el-option
              key="horizontal"
              :label="translateTitle('横向')"
              value="horizontal"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="translateTitle('主题')">
          <el-select v-model="theme.themeName" @change="updateTheme">
            <el-option
              key="ocean"
              :label="translateTitle('天空之城')"
              value="ocean"
            />
            <el-option
              key="blue-white"
              :label="translateTitle('蓝天白云')"
              value="blue-white"
            />
            <el-option
              key="green-white"
              :label="translateTitle('绿水青山')"
              value="green-white"
            />

            <el-option
              key="purple"
              :label="translateTitle('紫气东来')"
              value="purple"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="translateTitle('标签')" v-if="theme.layout!='comprehensive'">
          <el-switch v-model="theme.showTabs"/>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="el-drawer__footer">
      <el-button type="primary" @click="handleSaveTheme">
        {{ translateTitle('保存') }}
      </el-button>
      <el-button @click="setDefaultTheme">
        {{ translateTitle('恢复默认') }}
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import {translateTitle} from '@/utils/i18n'
import {mapActions, mapGetters} from 'vuex'
import _ from 'lodash'

export default {
  name: 'VabThemeDrawer',
  data() {
    return {
      drawerVisible: false,
    }
  },
  computed: {
    ...mapGetters({
      theme: 'settings/theme',
      device: 'settings/device',
    }),
  },
  created() {
    this.$baseEventBus.$on('theme', () => {
      this.handleOpenTheme()
    })
    this.$baseEventBus.$on('random-theme', () => {
      this.randomTheme()
    })
  },
  methods: {
    translateTitle,
    ...mapActions({
      saveTheme: 'settings/saveTheme',
      resetTheme: 'settings/resetTheme',
      updateTheme: 'settings/updateTheme',
    }),
    handTheme() {
      if (this.theme.layout == 'comprehensive') {
        this.theme.showTabs = false
      } else {
        this.theme.showTabs = true
      }
    },

    handleOpenTheme() {
      this.drawerVisible = true
    },
    async setDefaultTheme() {
      await this.resetTheme()
      if (this.theme.layout == 'comprehensive') {
        this.theme.showTabs = false
      } else {
        this.theme.showTabs = true
      }
      this.drawerVisible = false
    },
    async handleSaveTheme() {
      await this.saveTheme()
      this.drawerVisible = false
    },
    async randomTheme() {
      const loading = this.$baseColorfullLoading(0)
      // 随机换肤重置移除主题，防止代码更新影响样式
      await this.resetTheme()
      const themeNameArray = [
        'ocean',
        'blue-white',
        'green-white',
        'purple',
      ]
      this.theme.themeName = _.sample(
        _.pull(themeNameArray, [this.theme.themeName])
      )

      if (this.device === 'desktop') {
        const layoutArray = [
          'comprehensive',
          'common',
          'horizontal',
        ]
        this.theme.layout = _.sample(_.pull(layoutArray, [this.theme.layout]))
      } else this.theme.layout = 'vertical'
      await this.updateTheme()
      await this.saveTheme()
      setTimeout(() => {
        loading.close()
      }, 1000)
    },
  },
}
</script>

<style lang="scss">
.vab-drawer {
  .el-drawer__body {
    .el-scrollbar__wrap {
      height: calc(100vh - 100px);
      padding: $base-padding;

      .el-divider--horizontal {
        margin: $base-margin * 2 0 $base-margin * 2 0;
      }

      .el-form-item {
        display: flex;
        align-items: center;

        .el-form-item__label {
          flex: 1 1;
        }

        .el-form-item__content {
          flex: 0 0 auto;
        }

        @font-face {
          font-family: 'remixicon';
          font-display: swap;
        }

        &.vab-item-custom {
          display: block !important;
        }

        .el-radio-button {
          display: block;
          float: left;
          width: 80px;
          height: 80px;
          margin: 10px;
          cursor: pointer;
          border-radius: 5px;

          &.is-disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }

          &.is-active {
            box-shadow: 0 0 2px 2px #1890ff;
          }

          .el-radio-button__orig-radio,
          .el-radio-button__inner {
            display: none;
          }

          &.none {
            font-family: 'remixicon', sans-serif !important;
            font-size: 16px;
            font-weight: 580;
            line-height: 80px;
            text-align: center;
            background: #f7f7f7 none;
            background-size: cover;

            &:before {
              content: '\eace';
            }
          }

          &.vab-background {
            background: url(~@/assets/theme_images/background.png);
            background-size: cover;
          }
        }
      }

      .el-form-item--small.el-form-item {
        .el-input__inner {
          width: 115px;
        }
      }
    }

    .el-drawer__footer {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: $base-z-index + 1;
      padding: #{$base-padding/2};
      background: $base-color-white;
      border-top: 1px solid $base-border-color;
    }
  }
}
</style>
