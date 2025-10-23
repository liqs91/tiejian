<template>
  <div
      class="logo-container"
      :class="{
      ['logo-container-' + theme.layout]: true,
    }"
  >
    <router-link to="/">
      <span class="logo">
        <!-- 使用自定义svg示例 -->
        <vab-icon
            v-if="this.theme.themeName=='green-white'||this.theme.themeName=='blue-white'||this.theme.layout=='common'&&this.theme.themeName=='ocean'||this.theme.layout=='common'&&this.theme.themeName=='purple'"
            class="user-avatar" :icon="logo" is-custom-svg/>
        <vab-icon v-else class="user-avatar" icon="logoTwo" is-custom-svg/>
      </span>


      <span
          v-if="this.theme.layout=='common'||this.theme.layout=='horizontal'&&this.theme.themeName!='ocean'&&this.theme.themeName!='purple'"
          style="color: black;font-size: 25px;font-family: 优设标题黑; font-weight: bold"
          class="title"
          :class="{ 'hidden-xs-only': theme.layout === 'horizontal' }"
      >
        {{ title }}
      </span>

      <span
          v-if="this.theme.layout=='comprehensive'&&this.theme.themeName!='ocean'&&this.theme.themeName!='purple'"
          style="color: black;font-family: 优设标题黑; font-weight: bold"
          class="title"
          :class="{ 'hidden-xs-only': theme.layout === 'horizontal' }"
      >
        {{ title }}
      </span>


      <span
          v-else
          class="title"
          :class="{ 'hidden-xs-only': theme.layout === 'horizontal' }"
      >
        {{ title }}
      </span>
    </router-link>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'VabLogo',
  computed: {
    ...mapGetters({
      logo: 'settings/logo',
      logoTwo: 'settings/logoTwo',
      title: 'settings/title',
      theme: 'settings/theme',
    }),
  },
}
</script>

<style lang="scss" scoped>
@mixin container {
  position: relative;
  height: $base-top-bar-height;
  overflow: hidden;
  line-height: $base-top-bar-height;
  background: transparent;
}

@mixin logo {
  display: inline-block;
  width: 40px;
  height: 40px;
  color: $base-title-color;
  vertical-align: middle;
}

@mixin title {
  display: inline-block;
  margin-left: 5px;
  overflow: hidden;
  font-size: 20px;
  line-height: 55px;
  color: $base-title-color;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

@mixin title-common {
  display: inline-block;
  margin-left: 5px;
  overflow: hidden;
  font-size: 20px;
  line-height: 55px;
  color: #222;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.logo-container {
  &-horizontal,
  &-common {
    @include container;

    .logo {
      svg,
      img {
        @include logo;
      }
    }

    .title {
      @include title;
    }
  }

  &-vertical,
  &-column,
  &-comprehensive,
  &-float {
    @include container;

    height: $base-logo-height;
    line-height: $base-logo-height;
    text-align: center;

    .logo {
      svg,
      img {
        @include logo;
      }
    }

    .title {
      @include title;
      max-width: $base-left-menu-width - 60;
    }
  }

  &-column {
    background: $base-column-second-menu-background !important;

    .logo {
      position: fixed;
      top: 0;
      display: block;
      width: $base-left-menu-width-min;
      height: $base-logo-height;
      margin: 0;
      background: $base-column-first-menu-background;
    }

    .title {
      padding-right: 15px;
      padding-left: 15px;
      margin-left: $base-left-menu-width-min !important;
      color: $base-color-black !important;
      background: $base-column-second-menu-background !important;
      @include title;
    }
  }
}
</style>
