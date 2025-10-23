<template>
  <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
    <span class="avatar-dropdown">
<!--      <el-avatar class="user-avatar" :src="avatar" />-->
      <img v-if="avatar!=null" class="user-avatar" :src="path" height="40" width="40"
           style="object-fit: cover;">
      <img v-else class="user-avatar" :src="require('./user.gif')" height="40" width="40" style="object-fit: cover;">
      <div class="user-name">
        <span
          v-if="this.theme.layout=='common'"
          style="color: #515a6e"
          class="hidden-xs-only">
          {{ username }}</span>
        <span v-else class="hidden-xs-only">{{ username }}</span>
        <vab-icon
          v-if="this.theme.layout=='common'"
          style="color: #515a6e"
          class="vab-dropdown"
          :class="{ 'vab-dropdown-active': active }"
          icon="arrow-down-s-line"
        />

        <vab-icon
          v-else
          class="vab-dropdown"
          :class="{ 'vab-dropdown-active': active }"
          icon="arrow-down-s-line"
        />
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="personalCenter">
          <vab-icon icon="user-line"/>
          {{ translateTitle('个人中心') }}
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <vab-icon icon="logout-circle-r-line"/>
          {{ translateTitle('退出登录') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import {translateTitle} from '@/utils/i18n'
import {mapActions, mapGetters} from 'vuex'
import {toLoginRoute} from '@/utils/routes'

export default {
  name: 'VabAvatar',
  data() {
    return {
      path: null,
      active: false,
    }
  },
  computed: {
    ...mapGetters({
      avatar: 'user/avatar',
      username: 'user/username',
      theme: 'settings/theme',
    }),
  },

  created() {
    this.path = process.env.VUE_APP_BASE_API + this.avatar
  },

  methods: {
    translateTitle,
    ...mapActions({
      _logout: 'user/logout',
    }),
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'personalCenter':
          this.personalCenter()
          break
      }
    },
    handleVisibleChange(val) {
      this.active = val
    },
    personalCenter() {
      this.$router.push('/system/info')
    },
    async logout() {
      await this._logout()
      await this.$router.push(toLoginRoute(this.$route.fullPath))
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;

  .user-avatar {
    width: 40px;
    height: 40px;
    margin-left: 15px;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-name {
    position: relative;
    display: flex;
    align-content: center;
    align-items: center;
    height: 40px;
    margin-left: 6px;
    line-height: 40px;
    cursor: pointer;

    [class*='ri-'] {
      margin-left: 0 !important;
    }
  }
}
</style>
