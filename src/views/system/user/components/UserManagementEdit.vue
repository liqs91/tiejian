<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <el-form
      ref="form"
      label-width="80px"
      :model="form"
      :rules="rules"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="用户昵称"
            prop="nickName"
          >
            <el-input
              v-model="form.nickName"
              placeholder="请输入用户昵称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="手机号码"
            prop="phonenumber"
          >
            <el-input
              v-model="form.phonenumber"
              maxlength="11"
              placeholder="请输入手机号码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="邮箱"
            prop="email"
          >
            <el-input
              v-model="form.email"
              maxlength="50"
              placeholder="请输入邮箱"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            v-if="form.userId == undefined"
            label="用户名称"
            prop="userName"
          >
            <el-input
              v-model="form.userName"
              placeholder="请输入用户名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="form.userId == undefined"
            label="用户密码"
            prop="password"
          >
            <el-input
              v-model="form.password"
              placeholder="请输入用户密码"
              type="password"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户性别">
            <el-select
              v-model="form.sex"
              placeholder="请选择"
            >
              <el-option
                v-for="dict in sexOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >
                {{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select
              v-model="form.postIds"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in postOptions"
                :key="item.postId"
                :disabled="item.status == 1"
                :label="item.postName"
                :value="item.postId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select
              v-model="form.roleIds"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.roleId"
                :disabled="item.status == 1"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              placeholder="请输入内容"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="close">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="save"
      >
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getUser, addUser } from '@/api/system/user'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        // 状态数据字典
        statusOptions: [],
        // 性别状态字典
        sexOptions: [],
        // 岗位选项
        postOptions: [],
        // 角色选项
        roleOptions: [],
          form: {
          roles: [],
        },
        rules: {
          userName: [
            { required: true, message: '用户名称不能为空', trigger: 'blur' },
          ],
          nickName: [
            { required: true, message: '用户昵称不能为空', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '用户密码不能为空', trigger: 'blur' },
          ],
          email: [
            {
              type: 'email',
              message: "'请输入正确的邮箱地址",
              trigger: ['blur', 'change'],
            },
          ],
          phonenumber: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: 'blur',
            },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {
      getUser().then((response) => {
        this.postOptions = response.posts
        this.roleOptions = response.roles
      })
      this.getDicts('sys_normal_disable').then((response) => {
        this.statusOptions = response.data
      })
      this.getDicts('sys_user_sex').then((response) => {
        this.sexOptions = response.data
      })
      this.getConfigKey('sys.user.initPassword').then((response) => {
        this.initPassword = response.msg
      })
     },
    methods: {

      showEdit(row) {
        if (!row) {
          this.title = '新增'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await addUser(this.form)
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
    },
  }
</script>
