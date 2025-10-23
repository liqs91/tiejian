<template>
  <div>
    <el-col
      v-for="(item, index) in iconList" :key="index" :lg="3" :md="3" :sm="6" :xl="6" :xs="12">
      <el-card
        v-if="item.click && item.click === 'randomTheme'"
        class="top-card" :class="'top-card-' + item.background"
        shadow="hover"
        @click.native="randomTheme"
      >
        <span>{{ item.title }}</span>
        <p>
          <el-badge value="点我"/>
        </p>
        <div class="right-icon">
          <vab-icon :icon="item.icon"/>
        </div>
      </el-card>

      <el-card
        @click.native="gotoRouter(1)"
        v-else-if="item.click && item.click === 'task'"
        class="top-card" :class="'top-card-' + item.background"
        shadow="hover">
        <span>{{ item.title }}</span>
        <p>
          {{ item.sum }} 个
        </p>
        <div class="right-icon">
          <vab-icon :icon="item.icon"/>
        </div>
      </el-card>
      <el-card
        @click.native="gotoRouter(2)"
        v-else-if="item.click && item.click === 'project'"
        class="top-card" :class="'top-card-' + item.background"
        shadow="hover">
        <span>{{ item.title }}</span>
        <p>
          {{ item.sum }} 个
        </p>
        <div class="right-icon">
          <vab-icon :icon="item.icon"/>
        </div>
      </el-card>

      <vab-link v-else :to="item.link">
        <el-card
          class="top-card" :class="'top-card-' + item.background"
          shadow="hover">
          <span>{{ item.title }}</span>
          <p>
            {{ item.sum }} 个
          </p>
          <div class="right-icon">
            <vab-icon :icon="item.icon"/>
          </div>
        </el-card>
      </vab-link>
    </el-col>
  </div>
</template>

<script>

import {list} from "@/api/service/chart";

export default {
  data() {
    return {

      map: {},
      iconList: [
        {
          click: 'randomTheme',
          background: 'blue',
          sum: null,
          icon: 'apps-line',
          title: '随机换肤',
          link: '',
        },
        {
          click: 'project',
          background: 'white',
          sum: null,
          icon: 'projector-line',
          title: '我的项目',
          link: '/project/plist',
        },
        {
          click: 'task',
          background: 'white',
          sum: null,
          icon: 'task-line',
          title: '我的任务',
          link: '/task/tlist/',
        },
        {
          background: 'white',
          sum: null,
          icon: 'message-2-line',
          title: '我的消息',
          link: '/message/mlist',
        },
      ],
    }
  },
  created() {
    this.init();

  },

  methods: {
    async init() {
      await list().then(res => {
        if (res.code == 200) {
          this.map = res.data
          this.iconList[1].sum = this.map.project
          this.iconList[2].sum = this.map.task
          this.iconList[3].sum = this.map.info
         }
      })
    },
    gotoRouter(type) {
      if (type == 1) {
        this.$router.push({path: '/task/tlist/', query: {type: "2"}});
      } else if (type == 2) {
        this.$router.push({path: '/project/plist/', query: {type: "2"}});
      }
    },

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



