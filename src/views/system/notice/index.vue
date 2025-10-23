<template>
  <div class="app-container">

    <vab-query-form>
      <vab-query-form-left-panel :span="20">
        <el-form v-show="showSearch" ref="queryForm" :inline="true" label-width="68px" :model="queryForm">
          <el-form-item prop="createTimeStart">
            <el-date-picker v-model="queryForm.createTimeStart" placeholder="发布开始时间"
                            type="date"
                            :picker-options="pickerOptionsStart"
                            value-format="yyyy-MM-dd"/>
          </el-form-item>
          <el-form-item prop="createTimeEnd">
            <el-date-picker v-model="queryForm.createTimeEnd"
                            :picker-options="pickerOptionsEnd"
                            value-format="yyyy-MM-dd" placeholder="发布结束时间"
                            type="date"/>
          </el-form-item>
          <el-form-item prop="noticeType">
            <el-select v-model="queryForm.noticeType" clearable placeholder="公告类型" size="small">
              <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                         :value="dict.dictValue"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" plain @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>

      <vab-query-form-right-panel :span="4">
        <el-button icon="el-icon-plus" type="primary"  v-hasPermi="['system:menu:add']" plain @click="handleAdd">
          新增
        </el-button>
      </vab-query-form-right-panel>
    </vab-query-form>




    <el-table v-loading="loading" border :data="noticeList" @selection-change="handleSelectionChange">
      <!--        <el-table-column align="center" type="selection" width="55"/>-->
      <el-table-column show-overflow-tooltip align="center" fixed label="序号" width="70">
        <template slot-scope="scope">
          {{queryForm.pageSize * (queryForm.pageNo - 1) + (scope.$index + 1)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" prop="noticeTitle" :show-overflow-tooltip="true"/>
      <el-table-column align="center" :formatter="typeFormat" label="类型" prop="noticeType" width="100"/>
      <el-table-column align="center" :formatter="statusFormat" label="公告状态" prop="status" width="100"/>
      <el-table-column align="center" label="发布人" prop="createBy" />
      <el-table-column align="center" label="发布部门" prop="fbbm" :show-overflow-tooltip="true"/>
      <el-table-column align="center" label="发布时间" prop="createTime" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" v-hasPermi="['system:notice:edit']" icon="el-icon-view" type="info"
                     @click="handleSee(scope.row)">查看
          </el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:menu:remove']">删除
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

    <!-- 新增或修改公告对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="89%">
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model.trim="form.noticeTitle"  placeholder="请输入公告标题"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model.trim="form.noticeType" placeholder="请选择">
                <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                           :value="dict.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="关键词" prop="gjc">
              <el-input v-model.trim="form.gjc"  placeholder="若多个关键词请用逗号隔开"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="概述" prop="gs">
              <el-input v-model.trim="form.gs"  placeholder="请输入概述"/>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusOptions" :disabled="true" :key="dict.dictValue" :label="dict.dictValue">{{
                    dict.dictLabel
                  }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容" prop="noticeContent">
              <editor v-model.trim="form.noticeContent" :min-height="192" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" >
            <el-form-item label="上传附件">
              <el-upload
                class="upload-demo"
                :action="uploadFileUrl"
                :before-upload="beforeUpload"
                :show-file-list="true"
                :headers="headers"
                :file-list="fileListUploaded"
                :before-remove="beforeRemove"
                :on-success="onSuccessUpload"
              >
                <el-button size="small" type="primary">上传文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <NoticeSee ref="NoticeSee"/>

  </div>
</template>

<script>
import {
  listNotice,
  delNotice,
  addNotice,
  updateNotice,
} from '@/api/system/notice'
import Editor from '@/components/Editor'
import NoticeSee from "./components/NoticeSee";
import {getToken} from "@/utils/token";
export default {
  name: 'NoticeManage',
  components: {
    Editor,NoticeSee
  },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          const endDateVal = new Date(this.queryForm.createTimeEnd).getTime();
          if (endDateVal) {
            return time.getTime() > endDateVal
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          const beginDateVal = new Date(this.queryForm.createTimeStart).getTime();
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      layout: 'total, sizes, prev, pager, next, jumper',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      headers: {
        JwtAuthorization: "Bearer " + getToken(),
      },
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload",
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 公告表格数据
      noticeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],


      fileListUploaded:[],
      // 查询参数
      queryForm: {
        createTimeStart: null,
        createTimeEnd: null,
        pageNo: 1,
        pageSize: 10,
        noticeTitle: undefined,
        createBy: undefined,
        status: undefined,
      },
      // 表单参数
      form: {
        noticeId: undefined,
        noticeTitle: undefined,
        gjc: undefined,
        gs: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        status: '0',
        jshbj:'',
        jsqylx:'',
        fjxx:[],
      },
      // 表单校验
      rules: {
        noticeTitle: [
          {required: true, message: '公告标题不能为空', trigger: 'blur'},
        ],
        noticeType: [
          {required: true, message: '公告类型不能为空', trigger: 'change'},
        ],
        jshbj: [
          {required: true, message: '接收环保局为必选', trigger: 'change'},
        ],
        jsqylx: [
          {required: true, message: '接收企业类型为必选', trigger: 'change'},
        ],
        noticeContent: [
          {required: true, message: '公告内容不能为空', trigger: 'blur'},
        ],
        gjc: [
          {required: true, message: '关键词不能为空', trigger: 'blur'},
        ],
        gs: [
          {required: true, message: '概述不能为空', trigger: 'blur'},
        ],
      },
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_notice_status').then((response) => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_notice_type').then((response) => {
      this.typeOptions = response.data
    })


  },
  methods: {
    beforeRemove(res){
      if (! res.response){
        return ;
      }
      return this.$confirm(`是否确认删除【${res.response.originalFilename}】?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.form.fjxx.forEach((item, index) =>{
          if (item.ljdz === res.response.fileName){
            this.form.fjxx.splice(index, 1)
          }
        })
      })

    },

    onSuccessUpload(res){
      if (res.code === 200){
        let fjxx = {};
        fjxx.fjmc = res.originalFilename;
        fjxx.ljdz = res.fileName;
        fjxx.fjdx = res.size;
        this.form.fjxx.push(fjxx);
      }else{
        this.$message.error('上传失败！');
      }
    },
    //                :before-upload="beforeUpload"
    /*    beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 50;
            if (!isLt2M) {
              this.$message.error('上传文件大小不能超过 50MB!')
            }
            return isLt2M
        },*/

    //上传前的图片或文件格式和大小校验
    beforeUpload(file) {
      let hzm = file.name.slice(file.name.lastIndexOf('.') + 1);
      const isMatch = hzm === 'jpg'||hzm === 'pdf';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isMatch) {
        this.$message.error('图片或文件格式不匹配,请上传格式为.jpg或.pdf的文件')
      }
      if (!isLt2M) {
        this.$message.error('上传图片或文件大小不能超过 10MB!')
      }
      return isMatch && isLt2M
    },


    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.getList()
    },

    /** 查询公告列表 */
    getList() {
      this.loading = true
      listNotice(this.queryForm).then((response) => {
        this.noticeList = response.rows
        this.total = response.total
      }).finally(_=>{
        this.loading = false
      })
    },
    // 公告状态字典翻译
    // eslint-disable-next-line no-unused-vars
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 公告状态字典翻译
    // eslint-disable-next-line no-unused-vars
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.noticeType)
    },
    // 取消按钮
    cancel() {
      this.resetForm('form');
      this.open = false
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryForm.pageNo = 1;
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery();
    },
    resetForm(formName) {
      this.$nextTick(()=>{
        this.$refs[formName].resetFields();
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.noticeId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.fileListUploaded = [];
      this.title = '新增通知公告';
      this.form = {
        noticeId: undefined,
        noticeTitle: undefined,
        gjc: undefined,
        gs: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        status: '0',
        jshbj:'',
        jsqylx:'',
        fjxx:[],
      },
        this.open = true;
    },

    handleSee(row){
      this.$refs['NoticeSee'].showEdit(row);
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.noticeId != undefined) {
            updateNotice(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            if(this.form.jshbj instanceof Array){
              this.form.jshbj = this.form.jshbj.join(',');
            }
            if(this.form.jsqylx instanceof Array){
              this.form.jsqylx = this.form.jsqylx.join(',');
            }
            addNotice(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList();
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const noticeIds = row.noticeId || this.ids
      this.$confirm(
        '是否确认删除公告标题为【' + row.noticeTitle + '】的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(function () {
        return delNotice(noticeIds)
      })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功');
        })
        .catch(() => {
        })
    },
  },
}
</script>

<style>
.el-pagination {
  text-align: center;
  left: 0;
  margin: 0 auto;
}
</style>
