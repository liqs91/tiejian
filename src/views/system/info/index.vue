<template>
  <div class="personal-center-container">
    <el-row :gutter="20">
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <el-card shadow="hover" style="height: 680px">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <div class="personal-center-user-info">
            <el-avatar v-if="avatar!=null" :size="100" :src="path"/>
            <el-avatar v-else :size="100" :src="require('./user.gif')"/>
            <div class="personal-center-user-info-full-name">
              {{ entity.nickName }}
            </div>
            <ul class="personal-center-user-info-list">
              <li>
                <vab-icon icon="user-3-line"/>
                账号：{{ entity.userName }}
              </li>
              <li>
                <vab-icon icon="women-line"/>
                性别： {{ locationFormat(entity.sex) }}
              </li>
              <li>
                <vab-icon icon="admin-line"/>
                角色： {{ getRoleNames(entity) }}
              </li>
              <li>
                <vab-icon icon="organization-chart"/>
                归属部门：{{ entity.dept.deptName }}
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="16" :md="12" :sm="24" :xl="16" :xs="24">
        <el-card shadow="hover" style="height: 680px">
          <div slot="header" class="clearfix">
            <span>修改密码</span>
          </div>
          <el-col :lg="12" :md="16" :sm="24" :xl="12" :xs="24">
            <el-form ref="form" label-width="120px" :model="user" :rules="rules">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="user.oldPassword" placeholder="请输入旧密码" style="width: 550px" type="password"
                          show-password/>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="user.newPassword" placeholder="请输入新密码，8-20位字符，数字+特殊字符+字母组合"
                          style="width: 550px"
                          type="password" show-password/>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="user.confirmPassword" placeholder="请确认密码" style="width: 550px" type="password"
                          show-password/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {updateUserPwd} from "@/api/system/user";
import {mapGetters} from 'vuex'

export default {
  name: "Personal",
  computed: {
    ...mapGetters({
      avatar: 'user/avatar',
    }),
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      var reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_+<>?:"{},.\/\\;'[\]])[A-Za-z\d`~!@#$%^&*()_+<>?:"{},.\/\\;'[\]]{8,20}$/;
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
      activeName: "first",
      path: null,
      openDialog: false,
      sexOptions: [],
      entity: JSON.parse(localStorage.getItem("user")),
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
      },
      // 表单校验
      rules: {
        oldPassword: [
          {required: true, message: '旧密码不能为空', trigger: 'blur'},
        ],
        newPassword: [
          {required: true, message: '新密码不能为空', trigger: 'blur'},
          {validator: validatePassword, trigger: 'blur'},
          {min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '确认密码不能为空', trigger: 'blur'},
          {required: true, validator: equalToPassword, trigger: 'blur'},
        ],
      },
    };
  },
  created() {
    this.getDicts('sys_user_sex').then((response) => {
      this.sexOptions = response.data
    })
    this.path = process.env.VUE_APP_BASE_API + this.avatar
  },

  methods: {

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


    locationFormat(val) {
      return this.selectDictLabel(this.sexOptions, val);
    },
    reset() {
      this.user = {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
      };
      this.$refs['form'].resetFields();
    },

    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updateUserPwd(this.entity.userId, this.user.oldPassword, this.user.newPassword).then((res) => {
              if (res.code == 200) {
                this.msgSuccess('修改成功')
                this.reset();
              } else {
                this.msgError('修改失败')
              }
            }
          )
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
$base: '.personal-center';
#{$base}-container {
  padding: 0 !important;
  background: $base-color-background !important;

  #{$base}-user-info {
    padding: $base-padding;
    text-align: center;

    :deep() {
      .el-avatar {
        img {
          cursor: pointer;
        }
      }
    }

    &-full-name {
      margin-top: 15px;
      font-size: 24px;
      font-weight: 500;
      color: #262626;
    }

    &-description {
      margin-top: 8px;
    }

    &-follow {
      margin-top: 15px;
    }

    &-list {
      margin-top: 18px;
      line-height: 30px;
      text-align: left;
      list-style: none;

      h5 {
        margin: -20px 0 5px 0;
      }

      :deep() {
        .el-tag {
          margin-right: 10px !important;
        }

        .el-tag + .el-tag {
          margin-left: 0;
        }
      }
    }
  }

  #{$base}-item {
    display: flex;

    i {
      font-size: 40px;
    }

    &-content {
      box-sizing: border-box;
      flex: 1;
      margin-left: $base-margin;

      &-second {
        margin-top: 8px;
      }
    }
  }
}
</style>
