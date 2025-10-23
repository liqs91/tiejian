<template>
  <div>
    <div class="header-content">
      <div class="button-div">
        <el-button type="primary" size="mini" @click="submit">保存</el-button>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <el-form
          ref="form"
          label-width="80px"
          :model="user"
          :rules="rules"
        >
          <el-form-item
            label="旧密码"
            prop="oldPassword"
          >
            <el-input
              v-model="user.oldPassword"
              placeholder="请输入旧密码"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="newPassword"
          >
            <el-input
              v-model="user.newPassword"
              placeholder="请输入新密码，8-20位字符，数字+特殊字符+字母组合"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="confirmPassword"
          >
            <el-input
              v-model="user.confirmPassword"
              placeholder="请确认密码"
              type="password"
              show-password
            />
          </el-form-item>
          <!--      <el-form-item>-->
          <!--        <el-button-->
          <!--          size="mini"-->
          <!--          type="primary"-->
          <!--          @click="submit"-->
          <!--        >-->
          <!--          保存-->
          <!--        </el-button>-->
          <!--      <el-button-->
          <!--        size="mini"-->
          <!--        type="danger"-->
          <!--        @click="close"-->
          <!--      >-->
          <!--        关闭-->
          <!--      </el-button>-->
          <!--      </el-form-item>-->
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { updateUserPwd } from '@/api/system/user'

  export default {
    data() {
      const validatePassword = (rule, value, callback) => {
        var reg= /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_+<>?:"{},.\/\\;'[\]])[A-Za-z\d`~!@#$%^&*()_+<>?:"{},.\/\\;'[\]]{8,20}$/ ;
        if (!reg.test(value)) {
          callback(new Error('8-20位字符，数字+特殊字符+字母组合'))
        }
        if (this.user.confirmPassword) {
          this.$refs['form'].validateField('confirmPassword')
        }
        callback();
      }
      const equalToPassword = (rule, value, callback) => {
        if (this.user.newPassword !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }
      return {
        test: '1test',
        user: {
          oldPassword: undefined,
          newPassword: undefined,
          confirmPassword: undefined,
        },
        // 表单校验
        rules: {
          oldPassword: [
            { required: true, message: '旧密码不能为空', trigger: 'blur' },
          ],
          newPassword: [
            { required: true, message: '新密码不能为空', trigger: 'blur' },
            {validator: validatePassword, trigger: 'blur'},
            {min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur'}
          ],
          confirmPassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { required: true, validator: equalToPassword, trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      submit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            updateUserPwd(this.user.oldPassword, this.user.newPassword).then(
              // eslint-disable-next-line no-unused-vars
              (response) => {
                this.msgSuccess('修改成功')
                this.reset();
              }
            )
          }
        })
      },
      reset() {
        this.user = {
          oldPassword: undefined,
          newPassword: undefined,
          confirmPassword: undefined,
        };
        this.$refs['form'].resetFields();
      },
      close() {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.push({ path: '/index' })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .header-content {
    position: relative;
    margin-bottom: 18px;
    height: 44px;
    line-height: 44px;
    padding-left: 15px;
    font-size: 14px;
    font-weight: bold;
    background: #f4f4f4;
    .button-div {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
    }
  }
  .el-form-item:last-child{
    margin-bottom: 0;
    padding-bottom: 18px;
  }
</style>
