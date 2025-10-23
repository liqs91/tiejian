<template>
  <div class="app-container">
    <el-form :model="queryForm" ref="queryForm" size="small" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item label="" prop="userName">
        <el-input
          v-model="queryForm.userName"
          placeholder="用户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="sheetYear">
        <el-date-picker
          :clearable="false"
          v-model="queryForm.sheetYear"
          type="year"
          value-format="yyyy"
          placeholder="请选择年份"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" v-if="total!=0">
      <el-col v-for="item in list" :key="item.id" :span="4">
        <el-card class="task-item" shadow="hover">
          <template #header>
            【<span> {{ item.deptName }}</span>】
            <span style="font-weight: bold"> {{ item.userName }}</span>
            <el-tag class="card-header-tag">
              {{ item.sheetYear }}
            </el-tag>
          </template>
          <!--          <span v-if="item.avatar!=null" class="task-item-image-2" :style="backgroundStyle(item)"/>
                    <span v-else-if="item.sex==1" class="task-item-image-1"/>-->
          <span v-if="item.sex==1" class="task-item-image-1" @click="handleView(item)"/>
          <span v-else class="task-item-image-2" @click="handleView(item)"/>
          <div class="task-item-bottom">
            <el-button size="mini" plain type="danger">未完成({{ item.wwc }})
            </el-button>
            <el-button size="mini" plain type="primary">已完成({{ item.ywc }})
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-image v-else class="vab-data-empty" :src="require('@/assets/empty_images/data_empty.png')"/>

    <el-pagination
      v-if="total!=0"
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"/>
    <page-view ref="refView" @submit="getList" :key="Math.random()"/>
  </div>
</template>

<script>
import {sheetCountList} from "@/api/service/sheet";
import pageView from "@/views/api/sheet/components/pageView.vue";

export default {
  name: "Sheet",
  components: {pageView},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 一人一表统计数据
      list: [],
      layout: 'total, sizes, prev, pager, next, jumper',
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        userName: null,
        sheetYear: new Date().getFullYear().toString(),
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //查看详情
    handleView(row) {
      this.$refs['refView'].showPageView(row)
    },
    backgroundStyle(item) {
      return {
        backgroundImage: `url(${process.env.VUE_APP_BASE_API + item.avatar})`,
        backgroundSize: 'cover', // 可以根据需要添加其他背景样式
        backgroundPosition: 'center'
      };
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.getList()
    },
    //查询一人一列表
    getList() {
      this.loading = true;
      sheetCountList(this.queryForm).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    //搜索按钮操作
    handleQuery() {
      this.queryForm.pageNo = 1;
      this.getList();
    },
    //重置按钮操作
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery();
    },


  }
};
</script>
<style lang="scss" scoped>
.app-container {
  .el-col-4 {
    width: 20%;
  }

  @keyframes hoverAnimation {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.1);
    }
  }
  background: $base-color-background !important;

  .task-item-image-1:focus,
  .task-item-image-1:hover {
    background: url('~@/assets/index_images/user1.png') left center no-repeat;
    /*    animation: hoverAnimation 0.5s forwards; !* 应用动画 *!
        transform: scale(1.1); !* 鼠标悬停时放大图片 *!
        filter: blur(5px); !* 鼠标悬停时使图片模糊 *!*/
    transform: rotate(360deg); /* 鼠标悬停时旋转图片 */
  }

  .task-item-image-1 {
    transition: transform 0.5s; /* 确保变换有平滑的过渡效果 */
    cursor: pointer;
    width: 130px;
    height: 130px;
    background: url('~@/assets/index_images/user1.png') left center no-repeat;
  }

  .task-item-image-2:focus,
  .task-item-image-2:hover {
    background: url('~@/assets/index_images/user2.png') left center no-repeat;
    transform: rotate(360deg); /* 鼠标悬停时旋转图片 */
  }

  .task-item-image-2 {
    transition: transform 0.5s; /* 确保变换有平滑的过渡效果 */
    cursor: pointer;
    width: 130px;
    height: 130px;
    background: url('~@/assets/index_images/user2.png') left center no-repeat;
  }

  :deep() {
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

        .card-footer-tag {
          position: absolute;
          right: $base-margin;
          bottom: 20px;
        }
      }
    }
  }

  .task-item {
    /*    min-height: 180px;
        max-height: 260px;*/
    &-image-1 {
      display: block;
      width: 130px;
      margin: 0 auto 20px;
    }

    &-image-2 {
      display: block;
      width: 130px;
      margin: 0 auto 20px;
    }

    &-bottom {
      text-align: center;
    }
  }
}
</style>
