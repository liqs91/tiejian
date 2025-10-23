<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" :fullscreen="dialogFull" width="50%" @close="close"
             top="1vh">
    <div slot="title">
      <div>
        <span class="el-dialog__title">
          {{ title }}
        </span>
        <span class="icon-tool">
          <vab-icon :icon="dialogFull ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
                    @click="dialogFull ? (dialogFull = false) : (dialogFull = true)"/>
        </span>
      </div>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input style="width: 350px" v-model="form.projectName" placeholder="请输入项目名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目负责人" prop="userId">
            <el-select style="width: 350px"
                       v-model="form.userId"
                       @change="changeItem()"
                       placeholder="请选择">
              <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="'【'+item.dept.deptName+'】'+item.nickName"
                  :value="item.userId"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="项目联系人">
            <el-input style="width: 350px" v-model="form.projectLxr"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="projectLxdh">
            <el-input style="width: 350px" v-model="form.projectLxdh"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="项目状态">
            <el-select style="width: 350px"
                       v-model="form.projectState"
                       placeholder="请选择">
              <el-option
                  v-for="item in projectStateOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="parseInt(item.dictValue)"/>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="完成期限">
            <el-date-picker clearable
                            style="width: 100%"
                            :picker-options="pickerOptions"
                            v-model="form.projectDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择完成期限"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始时间">
            <el-date-picker clearable
                            style="width: 100%"
                            :picker-options="pickerOptions"
                            v-model="form.startTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择开始时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间">
            <el-date-picker clearable
                            style="width: 100%"
                            v-model="form.endTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="请选择结束时间"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="项目进度百分比">
            <el-slider v-model="form.projectBar" show-input/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="项目内容">
            <el-input v-model="form.projectContent" :autosize="{minRows: 4, maxRows: 4}"
                      type="textarea"
                      placeholder="请输入项目内容"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <div style="text-align: center">
      <el-button @click="close" :style="{padding: '8px 30px', fontSize: '14px', borderRadius: '4px'}">取消
      </el-button>
      <el-button type="primary" @click="save"
                 :style="{padding: '8px 30px', fontSize: '14px', borderRadius: '4px'}"> 提交
      </el-button>
    </div>


  </el-dialog>
</template>

<script>

import {addProject, updateProject} from "@/api/service/project";
import {findListUser} from "@/api/system/user";
import {parseInt} from "lodash";
import {isPhone} from "@/utils/validate";


export default {
  name: 'Edit',
  data() {
    let checkPhone = (rule, value, callback) => {
      if (value && !isPhone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    };
    return {
      pickerOptions: { // 日期选择器的配置项
        disabledDate(time) {
          // 获取当前年份
          const currentYear = new Date().getFullYear();
          // 如果选择的年份不是当前年份，则禁用该日期
          return time.getFullYear() !== currentYear;
        }
      },
      title: '',
      dialogFull: false,
      dialogFormVisible: false,
      userList: [],
      projectStateOptions: [],
      form: {
        projectName: null,
        projectContent: null,
        userId: null,
        userName: null,
        projectDate: null,
        startTime: null,
        endTime: null,
        projectLxr: null,
        projectLxdh: null,
        projectState: 1,
        projectBar: null,
        draft_state: null
      },
      // 表单校验
      rules: {
        projectName: [{required: true, message: "项目名称不能为空", trigger: "blur"}],
        userId: [{required: true, message: "请选择项目负责人不能为空", trigger: "blur"}],
        projectLxdh: [{validator: checkPhone, trigger: 'blur'}],
      },
    }
  },
  created() {
    this.getDicts('project_state').then((response) => {
      this.projectStateOptions = response.data
    })
    this.findUserList()
  },
  methods: {

    parseInt,
    showPageEdit(row) {
      if (!row) {
        this.title = '添加项目'
      } else {
        this.title = '修改项目'
        this.form = row
      }
      this.dialogFormVisible = true
    },

    findUserList() {
      findListUser().then(response => {
        this.userList = response.data
      });
    },

    changeItem() {
      for (let i = 0; i < this.userList.length; i++) {
        if (this.form.userId == this.userList[i].userId) {
          this.form.userName = this.userList[i].nickName
        }
      }
    },
    close() {
      this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.$emit('submit')
      this.dialogFormVisible = false
    },
    save() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (!this.form.id) {
            addProject(this.form).then(response => {
              if (response.code == 200) {
                this.$baseMessage("新增成功", 'success')
                this.$emit('submit')
                this.close()
              } else {
                this.$baseMessage(response.msg, 'error')
              }
            });
          } else {
            updateProject(this.form).then(response => {
              if (response.code == 200) {
                this.$baseMessage("编辑成功", 'success')
                this.$emit('submit')
                this.close()
              } else {
                this.$baseMessage(response.msg, 'error')
              }
            });
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>
