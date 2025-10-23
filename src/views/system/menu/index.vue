<template>
  <div class="menu-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.menuName" clearable placeholder="请输入菜单名称"/>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" size="mini" type="primary" @click="fetchData">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-button icon="el-icon-plus" plain type="primary" @click="handleAdd(1)">新增</el-button>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="menuList" row-key="menuId"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}" border>
      <el-table-column align="center" prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"/>
      <el-table-column align="center" prop="icon" label="图标" width="100">
        <template slot-scope="scope">
          <vab-icon :icon="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="orderNum" label="排序" width="60"/>
      <el-table-column align="center" prop="component" label="组件路径" :show-overflow-tooltip="true"/>
      <el-table-column align="center" prop="perms" label="权限标识" :show-overflow-tooltip="true"/>
      <el-table-column align="center" prop="status" label="状态" :formatter="statusFormat" width="80"/>
      <el-table-column align="center" label="创建时间" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注" width="140"/>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="even"  icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          <el-button size="mini" type="primary"  icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
          <el-button size="mini" type="danger"  icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"/>
    <edit ref="edit" @fetch-data="fetchData"/>
  </div>
</template>

<script>
import Edit from './components/MenuEdit'
import {listMenu, delMenu} from '@/api/system/menu'

export default {
  name: 'Menu',
  components: {Edit},
  data() {
    return {
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      list: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        menuName: null,
        visible: null
      },
    }
  },
  created() {
    this.fetchData();
    this.getDicts("sys_show_hide").then(response => {
      this.visibleOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 菜单状态字典翻译
    statusFormat(row) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    setSelectRows(val) {
      this.selectRows = val
    },
    handleEdit(row) {
      if (row.menuId) {
        this.$refs['edit'].showEdit(row)
      }
    },
    handleAdd(row) {
      this.$refs['edit'].showEdit();
      this.$refs['edit'].getParentID(row.menuId)
    },
    handleDelete(row) {
      if (row.menuId) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          const {msg} = await delMenu(row.menuId)
          this.$baseMessage(msg, 'success')
          await this.fetchData()
        })
      } else {
        return false
      }
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },

    /** 查询菜单列表 */
    fetchData() {
      this.listLoading = true;
      listMenu(this.queryForm).then(response => {
        this.menuList = this.handleTree(response.data, "menuId");
        this.listLoading = false;
      });
    },
  },
}
</script>
