<template>
  <div class="app-container">

    <el-form :model="queryForm" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-row :gutter="20">
        <el-col :span="21">
          <el-form-item label="" prop="type">
            <el-select v-model="queryForm.type" placeholder="我的项目">
              <el-option v-for="dict in myProjectOptions"
                         :key="dict.dictValue"
                         :label="dict.dictLabel"
                         :value="dict.dictValue"/>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="projectName">
            <el-input
              v-model="queryForm.projectName"
              placeholder="项目名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="" prop="userName">
            <el-input
              v-model="queryForm.userName"
              placeholder="项目负责人"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button v-hasPermi="['api:project:add']" plain icon="el-icon-plus" type="primary" @click="handleAdd">新增
            </el-button>
            <el-button v-hasPermi="['api:project:export']" plain icon="el-icon-download" type="warning"
                       @click="handleExport">导出
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="卡片" name="first">
        <el-row :gutter="20">
          <el-col v-for="item in projectList" :key="item.id" :span="4">
            <el-card class="task-item" shadow="hover">
              <template #header>
                <!--                【<span> {{ item.userName }}</span>】-->
                <span style="font-weight: bold;width: 85%;float: left"> {{ item.projectName }}</span>
                <el-tag style="float: right" class="card-header-tag" :type="getTagType(item)">
                  {{ projectStateFormat(item) }}
                </el-tag>
              </template>

              <span class="task-item-image" @click="handleView(item)"/>
              <div class="task-item-bottom">
                <el-button size="mini" icon="el-icon-edit" type="text" @click="handleUpdate(item)">修改</el-button>
                <el-button size="mini" icon="el-icon-delete" type="text" @click="handleDelete(item)">删除</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="列表" name="second">
        <el-table border v-loading="loading" :data="projectList">
          <el-table-column align="center" label="序号" width="70" type="index" fixed="left">
            <template slot-scope="scope">
              {{ queryForm.pageSize * (queryForm.pageNo - 1) + (scope.$index + 1) }}
            </template>
          </el-table-column>
          <el-table-column label="项目名称" align="center" prop="projectName" show-overflow-tooltip fixed="left">
            <template slot-scope="scope">
            <span style="color: #1e8bf1;cursor: pointer;" @click="handleView(scope.row)">
             {{ scope.row.projectName }}
            </span>
            </template>
          </el-table-column>
          <el-table-column label="项目负责人" align="center" prop="userName" width="130">
            <template slot-scope="scope">
              <el-tag size="medium">
                <vab-icon icon="user-fill"/>
                {{ scope.row.userName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="项目联系人" align="center" prop="projectLxr" width="110"/>
          <el-table-column label="联系电话" align="center" prop="projectLxdh" width="130"/>
          <el-table-column label="完成期限" align="center" prop="projectDate" width="130"/>
          <el-table-column label="开始时间" align="center" prop="startTime" width="170"/>
          <el-table-column label="结束时间" align="center" prop="endTime" width="170"/>
          <el-table-column label="项目状态" align="center" prop="projectState">
            <template slot-scope="scope">
              <el-tag :type="getTagType(scope.row)">
                {{ projectStateFormat(scope.row) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="项目进度" align="center" prop="projectBar" width="180">
            <template slot-scope="scope">
              <el-progress :text-inside="true" :stroke-width="15"
                           :percentage="scope.row.projectBar>100?100:scope.row.projectBar"
                           :color="handleProgress(scope.row)"/>
            </template>
          </el-table-column>
          <!-- <el-table-column label="项目内容" align="center" prop="projectContent" width="200" show-overflow-tooltip/>
               <el-table-column label="草稿状态" align="center" prop="draftState"/>
               <el-table-column label="状态" align="center" prop="status"/>
               <el-table-column label="备注" align="center" prop="remark"/>-->
          <el-table-column label="创建人" align="center" prop="createName" width="100"/>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180"/>
          <el-table-column label="操作" align="center" fixed="right" width="260">
            <template slot-scope="scope">
              <el-button
                size="mini" type="even"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['api:project:edit']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="report"
                icon="el-icon-view"
                @click="handleView(scope.row)"
              >详情
              </el-button>
              <el-button
                size="mini" type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['api:project:remove']"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-pagination
        background
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"/>
    </el-tabs>

    <page-view ref="refView" @submit="getList" :key="Math.random()"/>
    <page-add ref="refEdit" @submit="getList" :key="Math.random()"/>

  </div>


</template>

<script>
import {delProject, listProject} from "@/api/service/project";
import pageView from "@/views/api/project/components/pageView.vue";
import pageAdd from "@/views/api/project/components/pageEdit.vue";

export default {
  name: "Project",
  components: {pageView, pageAdd},
  data() {
    return {
      // 遮罩层
      loading: true,
      activeName: "first",
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 项目表格数据
      projectList: [],
      projectStateOptions: [],
      myProjectOptions: [],
      layout: 'total, sizes, prev, pager, next, jumper',
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        type: "1",
        projectName: null,
        projectContent: null,
        userId: null,
        userName: null,
        projectDate: null,
        startTime: null,
        endTime: null,
        projectType: null,
        projectLxr: null,
        projectLxdh: null,
        projectState: null,
        projectBar: null,
        draftState: null,
        status: null,
        createName: null,
        updateName: null,
      },

    };
  },
  created() {
    const type = this.$route.query.type
    if (type) {
      this.queryForm.type = type
    }
    this.getDicts('project_state').then((response) => {
      this.projectStateOptions = response.data
    })
    this.getDicts('my_project').then((response) => {
      this.myProjectOptions = response.data
    })
    this.getList();
  },
  methods: {

    getTagType(row) {
      if (row.projectState == 1) {
        return '';
      } else if (row.projectState == 2) {
        return 'danger';
      } else if (row.projectState == 3) {
        return 'success';
      }
    },

    projectStateFormat(row) {
      return this.selectDictLabel(this.projectStateOptions, row.projectState);
    },
    //查看详情
    handleView(row) {
      this.$refs['refView'].showPageView(row)
    },

    //新增按钮操作
    handleAdd() {
      this.$refs['refEdit'].showPageEdit()
    },
    //修改按钮操作
    handleUpdate(row) {
      this.$refs['refEdit'].showPageEdit(row)
    },

    handleProgress(row) {
      if (row.projectBar < 30) {
        return '#f56c6c';
      } else if (row.projectBar < 60) {
        return '#e6a23c';
      } else if (row.projectBar < 90) {
        return '#409eff';
      } else if (row.projectBar > 99) {
        return '#67C23A';
      }
    },

    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.getList()
    },
    //查询项目列表
    getList() {
      this.loading = true;
      listProject(this.queryForm).then(response => {
        this.projectList = response.rows;
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


    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除项目编号为"' + ids + '"的数据项？').then(function () {
        return delProject(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    //导出按钮操作
    handleExport() {

    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .el-col-4 {
    width: 20%;
  }

  background: $base-color-background !important;

  .task-item-image:focus,
  .task-item-image:hover {
    background: url('~@/assets/index_images/project1.png') left center no-repeat;

  }

  .task-item-image {
    cursor: pointer;
    width: 130px;
    height: 130px;
    background: url('~@/assets/index_images/project2.png') left center no-repeat;

  }

  :deep() {
    .el-card {
      .el-card__header {
        position: relative;
        height: 55px;
        .card-header-tag {
          position: absolute;
          top: 15px;
          right: 10px;;
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
    min-height: 180px;
    max-height: 260px;

    &-image {
      display: block;
      width: 130px;
      margin: 0 auto 20px;
    }

    &-bottom {
      text-align: center;
      border-top: 1px solid #ebeef5;


    }
  }


}
</style>
