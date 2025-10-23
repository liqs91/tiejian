<template>
  <div>
    <el-col
      v-for="(item, index) in iconList"
      :key="index"
      :lg="3"
      :md="3"
      :sm="6"
      :xl="6"
      :xs="12"
    >
      <el-card
        v-if="item.click && item.click === 'changeTheme'"
        class="icon-panel"
        shadow="hover"
        @click.native="changeTheme"
      >
        <vab-icon :icon="item.icon" :style="{ color: item.color }"/>
        <p>{{ item.title }}</p>
      </el-card>
      <el-card
        v-else-if="item.click && item.click === 'randomTheme'"
        class="icon-panel"
        shadow="hover"
        @click.native="randomTheme"
      >
        <el-badge value="点我">
          <vab-icon :icon="item.icon" :style="{ color: item.color }"/>
        </el-badge>
        <p>{{ item.title }}</p>
      </el-card>
      <el-card
        v-else-if="item.click && item.click === 'handleMore'"
        class="icon-panel"
        shadow="hover"
        @click.native="handleMore"
      >
        <vab-icon :icon="item.icon" :style="{ color: item.color }"/>
        <p>{{ item.title }}</p>
      </el-card>
      <vab-link v-else :to="item.link">
        <el-card class="icon-panel" shadow="hover">
          <vab-icon :icon="item.icon" :style="{ color: item.color }"/>
          <p>{{ item.title }}</p>
        </el-card>
      </vab-link>
    </el-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 卡片图标
      iconList: [
        {
          click: 'randomTheme',
          icon: 'apps-line',
          title: '随机换肤',
          link: '',
          color: '#1890FF',
        },
        {
          icon: 'projector-line',
          title: '项目管理',
          link: '/project/plist',
          color: '#1890FF',
        },
        {
          icon: 'task-line',
          title: '任务管理',
          link: '/task/tlist',
          color: '#1890FF',
        },
        {
          icon: 'message-2-line',
          title: '我的消息',
          link: '/message/mlist',
          color: '#1890FF',
        },
      ],
    }
  },
  methods: {
    changeTheme() {
      this.$baseEventBus.$emit('theme')
    },
    handleMore() {
      this.$baseAlert('敬请期待！')
    },
    randomTheme() {
      this.$baseEventBus.$emit('random-theme')
    },
  },
}
</script>

<style lang="scss" scoped>
.icon-panel {
  height: 200px;
  text-align: center;
  cursor: pointer;
  padding: 45px;

  &:hover {
    i {
      transform: scale(1.15);
    }
  }

  i {
    display: block;
    width: 50px;
    height: 50px;
    margin: auto;
    font-size: 50px;
    transition: all ease-in-out 0.3s;
  }

  p {
    margin-top: 10px;
  }
}
</style>
