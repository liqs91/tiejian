<!--
<template>
  <div class="profile">
    <el-row>
      <el-col :span="4" v-for="(item, index)  in list" :key="index">
        <el-card>
          <span :class="item.key" @click="gotoRouter(item)"></span>
          <span class="top_text"  @click="gotoRouter(item)">{{ item.name }}:{{ item.sum }}</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import {listProfile} from "@/api/service/chart";

export default {
  name: 'Profile',
  data() {
    return {
      list: null,
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      listProfile().then((res) => {
        if (res.code == 200) {
          this.list = res.data
        }
      })
    },

    gotoRouter(item) {
      if (item.key == "market") {
        this.$router.push('/main/market');
      } else if (item.key == "merchant") {
        this.$router.push('/main/merchant');
      } else if (item.key == "device") {
        this.$router.push('/main/device');
      } else if (item.key == "online") {
        this.$router.push({name: 'Monitor', params: {isLine: "1"}});
      } else if (item.key == "offline") {
        this.$router.push({name: 'Monitor', params: {isLine: "0"}});
      } else if (item.key == "alarm") {
        this.$router.push('/alarm/record');
      }
    },
  }

}
</script>

<style lang="scss" scoped>
.profile {


  :deep() {
    .el-card {
      height: 130px;
      cursor: pointer;
      background-color: #D4C2FF; /* 修改为你想要的颜色 */
    }

    .top_text {
      font-weight: bold;
      font-size: 15px;
      color: #0f2027;
      float: right;
      text-align: center;
      padding: 30px
    }

    .top_text:hover {
      color: #006cff;
    }

    .market {
      position: absolute;
      width: 100px;
      height: 100px;
      background: url('~@/assets/index_images/org.png') left center no-repeat;
    }


    .merchant {
      position: absolute;
      width: 100px;
      height: 100px;
      background: url('~@/assets/index_images/user.png') left center no-repeat;
    }


    .device {
      position: absolute;
      width: 100px;
      height: 100px;
      background: url('~@/assets/index_images/device.png') left center no-repeat;
    }


    .online {
      position: absolute;
      width: 100px;
      height: 100px;
      background: url('~@/assets/index_images/line.png') left center no-repeat;
    }


    .offline {
      position: absolute;
      width: 100px;
      height: 100px;
      background: url('~@/assets/index_images/offline.png') left center no-repeat;
    }


    .alarm {
      position: absolute;
      width: 100px;
      height: 100px;
      background: url('~@/assets/index_images/warning.png') left center no-repeat;
    }

  }
}


</style>
-->
