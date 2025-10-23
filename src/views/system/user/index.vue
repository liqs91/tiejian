<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="3" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable prefix-icon="el-icon-search"
                    size="small" style="margin-bottom: 20px"/>
        </div>
        <div class="head-container">
          <el-tree style="height: 600px;overflow-y: auto"
                   :data="deptOptions" :props="defaultProps" :expand-on-click-node="false"
                   :filter-node-method="filterNode" ref="tree" node-key="id" default-expand-all highlight-current
                   @node-click="handleDeptNodeClick"/>
        </div>

      </el-col>
      <!--用户数据-->
      <el-col :span="21" :xs="24">
        <vab-query-form>
          <vab-query-form-left-panel :span="12">
            <el-form :inline="true" :model="queryForm" @submit.native.prevent>
              <el-form-item>
                <el-input v-model.trim="queryForm.userName" clearable
                          placeholder="请输入用户名称"/>
              </el-form-item>
              <el-form-item>
                <el-input v-model="queryForm.phonenumber" clearable placeholder="请输入手机号码"
                          @keyup.enter.native="handleQuery"/>
              </el-form-item>

              <el-form-item>
                <el-button icon="el-icon-search" type="primary" size="mini" @click="getList">查询</el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel :span="12">
            <el-button v-hasPermi="['system:user:add']" plain icon="el-icon-plus" type="primary" @click="handleAdd">新增
            </el-button>
          </vab-query-form-right-panel>
        </vab-query-form>


        <el-table v-loading="loading" border :data="userList">
          <el-table-column align="center" label="序号" width="70" type="index"/>
          <el-table-column align="center" label="归属部门" prop="dept.deptName" :show-overflow-tooltip="true"/>
          <el-table-column align="center" label="用户账号" prop="userName"/>
          <el-table-column align="center" label="用户姓名" prop="nickName"/>
          <el-table-column align="center" label="用户角色" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ getRoleNames(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" prop="status">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-value="0" inactive-value="1"
                         @change="handleStatusChange(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" prop="createTime" width="160"/>
          <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="280">
            <template slot-scope="scope">
              <el-button :disabled="scope.row.userId=='1'" v-hasPermi="['system:user:edit']" icon="el-icon-edit"
                         size="mini"
                          type="even" @click="handleUpdate(scope.row)">修改
              </el-button>
              <el-button :disabled="scope.row.userId=='1'" v-if="scope.row.userId !== 1"
                         v-hasPermi="['system:user:remove']" size="mini"
                         icon="el-icon-delete"
                          type="danger" @click="handleDelete(scope.row)">删除
              </el-button>
              <el-button :disabled="scope.row.userId=='1'" v-hasPermi="['system:user:resetPwd']" size="mini"
                         icon="el-icon-key"
                         type="back" @click="handleResetPwd(scope.row)">重置
              </el-button>
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
      </el-col>
    </el-row>

    <!-- 新增或修改参数配置对话框 -->

    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="enabledDeptOptions"
                :show-count="true"
                :normalizer="normalizer"
                placeholder="请选择归属部门"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20"
                        show-password/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-radio-group v-model="form.sex">
                <el-radio
                  v-for="dict in sexOptions" :key="dict.dictValue"
                  :label="dict.dictValue">{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions" :key="dict.dictValue"
                  :label="dict.dictValue">{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位" prop="postIds">
              <el-select v-model="form.postIds" multiple placeholder="请选择岗位">
                <el-option v-for="item in postList" :key="item.postId" :label="item.postName" :value="item.postId"
                           :disabled="item.status == 1"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
                <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"
                           :disabled="item.status == 1"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addUser,
  changeUserStatus,
  delUser,
  deptTreeSelect,
  getUser,
  listUser,
  resetUserPwd,
  updateUser,
} from '@/api/system/user'
import {optionSelect} from '@/api/system/role'
import {listPostAll} from '@/api/system/post'
import {isPhone, passWordLegal} from "@/utils/validate";
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"

export default {
  name: 'User',
  components: {Treeselect},
  data() {
    let checkPwd = (rule, value, callback) => {
      if (value && passWordLegal(value)) {
        callback()
      } else {
        callback(new Error('密码必须有字母+数字+特殊字符组成,不小于8位！'))
      }
    };
    let checkPhone = (rule, value, callback) => {
      if (value && !isPhone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    };

    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 区域树选项
      deptOptions: undefined,
      enabledDeptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 区域名称
      areaName: undefined,
      deptName: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleList: [],
      // 岗位选项
      postList: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        userName: null,
        phonenumber: null,
        deptId: null,
        status: null,
      },
      // 表单校验
      rules: {
        nickName: [{required: true, message: '用户昵称不能为空', trigger: 'blur'},],
        userName: [{required: true, message: '用户账号不能为空', trigger: 'blur'},],
        deptId: [{required: true, message: '归属部门不能为空', trigger: 'change'}],
        roleIds: [{required: true, message: '角色不能为空', trigger: 'change'},],
        postIds: [{required: true, message: '岗位不能为空', trigger: 'blur'},],
        password: [{required: true, message: '用户密码不能为空', trigger: 'blur'}, {
          validator: checkPwd,
          trigger: 'blur'
        }],
        email: [{type: 'email', message: "'请输入正确的邮箱地址", trigger: ['blur', 'change'],},],
        phonenumber: [{validator: checkPhone, trigger: 'blur'}],

      },
    }
  },
  watch: {
    // 根据名称筛选区域树
    areaName(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    this.getList()
    this.getDeptTree();
    this.getDicts('sys_normal_disable').then((response) => {
      this.statusOptions = response.data
    })

    this.getDicts('sys_user_sex').then((response) => {
      this.sexOptions = response.data
    })
  },
  methods: {


    normalizer(node) {
      const nodeId = node.deptId ? node.deptId : node.id;
      return {
        id: nodeId,
        label: node.label,
        children: node.children && node.children.length > 0 ? node.children : 0,
      };

    },

    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
        this.enabledDeptOptions = this.filterDisabledDept(JSON.parse(JSON.stringify(response.data)));
      });
    },

    // 过滤禁用的部门
    filterDisabledDept(deptList) {
      return deptList.filter(dept => {
        if (dept.disabled) {
          return false;
        }
        if (dept.children && dept.children.length) {
          dept.children = this.filterDisabledDept(dept.children);
        }
        return true;
      });
    },


    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.getList()
    },
    //查询用户列表
    getList() {
      this.loading = true
      listUser(this.addDateRange(this.queryForm, this.dateRange)).then(
        (response) => {
          this.userList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },

    //查询岗位列表
    findPostList() {
      listPostAll().then((response) => {
        this.postList = response.data
      })
    },


    //查询岗位列表
    findRoleList() {
      optionSelect().then((response) => {
        this.roleList = response.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    // 节点单击事件
    handleDeptNodeClick(data) {
      this.queryForm.deptId = data.deptId;
      this.getList();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(function () {
        return changeUserStatus(row.userId, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function () {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userId: null,
        deptId: null,
        postIds: null,
        lsxzqh: null,
        userName: null,
        nickName: null,
        password: null,
        phonenumber: null,
        email: null,
        sex: '0',
        status: '0',
        remark: null,
        roleIds: [],
      }
      this.resetForm('form')
    },
    //搜索按钮操作
    handleQuery() {
      this.queryForm.pageNo = 1
      this.getList()
    },
    //重置按钮操作
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },

    //新增按钮操作
    handleAdd() {
      this.reset()
      this.findPostList()
      this.findRoleList()
      this.open = true
      this.title = '新增用户'
    },
    //修改按钮操作
    handleUpdate(row) {
      this.reset()
      this.findPostList()
      this.findRoleList()
      const userId = row.userId || this.ids
      getUser(userId).then((response) => {
        this.form = response.data
        this.form.roleIds = response.roleIds
        this.form.postIds = response.data.postIds.split(',')
        this.open = true
        this.title = '修改用户'
      })
    },


    getRoleNames(row) {
      let roleName = "";
      if (row.userId == '1') {
        roleName = "超级管理员"
      } else {
        for (let i = 0; i < row.roles.length; i++) {
          if (i > 0) {
            roleName += ', '; // 在除第一个元素之外的每个元素前添加逗号和空格
          }
          roleName += row.roles[i].roleName
        }
      }
      return roleName
    },

    //重置密码按钮操作
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.nickName + '"的新用户密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(({value}) => {
          // eslint-disable-next-line no-unused-vars
          resetUserPwd(row.userId, value).then((response) => {
            this.msgSuccess('修改成功，新用户密码是：' + value)
          })
        })
        .catch(() => {
        })
    },
    //提交按钮
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.postIds = this.form.postIds.toString()

          if (this.form.userId != undefined) {
            // eslint-disable-next-line no-unused-vars
            updateUser(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            // eslint-disable-next-line no-unused-vars
            addUser(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    //删除按钮操作
    handleDelete(row) {
      const userIds = row.userId || this.ids
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delUser(userIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(() => {
        })
    },
  },
}
</script>
