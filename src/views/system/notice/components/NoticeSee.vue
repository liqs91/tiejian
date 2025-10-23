<template>
  <el-dialog :fullscreen="dialogFull" :title="title" :visible.sync="dialogFormVisible" width="89%" @close="close">
    <div slot="title">
      <div class="avue-crud__dialog__header">
        <span class="el-dialog__title">
          {{ '查看公告' }}
        </span>
        <div class="avue-crud__dialog__menu"
             @click="dialogFull ? (dialogFull = false) : (dialogFull = true)">
          <i class="el-icon-full-screen"></i>
        </div>
      </div>
    </div>
    <div>
      <h2 style="align-items: center;justify-content: center;display: flex;">{{this.form.noticeTitle}}</h2>
    </div>

    <el-form
      ref="form"
      label-width="120px"
      :model="form"
      :disabled="true"
    >
      <el-row >
        <el-col :span="5" ><span class="r" >公告类型:</span><span>{{formatType(form.noticeType)}}</span></el-col>
        <el-col :span="5"><span class="r">关键词:</span><span>{{form.gjc}}</span></el-col>
        <el-col :span="6"><span class="r">发布部门:</span><span>{{form.fbbm}}</span></el-col>
        <el-col :span="4"><span class="r">发布时间:</span><span>{{form.createTime}}</span></el-col>
      </el-row>
      <el-row>
        <div class="gs">
          <span class="title">概述:</span> <span>{{form.gs}}</span>
        </div>
      </el-row>


      <el-row>
        <el-col :span="24" >
          <editor  v-model="form.noticeContent" readOnly :min-height="192" />
        </el-col>
      </el-row>

    </el-form>
    <div style="margin-top: 20px" v-if="this.form.fjxx && this.form.fjxx.length > 0">
      <el-table
        :data="this.form.fjxx"
        stripe
        style="width: 100%">
        <el-table-column
          prop="fjmc"  label="附件名称"
        >
          <template slot-scope="scope">
            <a class="linkA" @click.prevent="downloadFile(scope.row)" target="_blank">{{scope.row.fjmc}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="fjdx"  label="附件大小/KB"
        >
        </el-table-column>
        <el-table-column
          prop="cjsj"  label="上传时间"
        >
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import Editor from '@/components/Editor'
import {
  getNotice,
} from '@/api/system/notice'

export default {
  name: 'NoticeManageSee',
  components: {Editor },
  data() {
    return {
      dialogFull: true,
      url: location.protocol + '//' + location.host,
      typeOptions:[],


      form: {
        noticeContent:''
      },
      title: '',
      dialogFormVisible: false,
    }
  },
  created() {
    this.getDicts('sys_notice_type').then((response) => {
      this.typeOptions = response.data
    })

  },
  methods: {
    formatType(value){
      if (! value){
        return null;
      }
      let typeObj = this.typeOptions.find(item =>{
        return item.dictValue == value;
      });
      return typeObj ? typeObj.dictLabel : '';
    },
    /** 下载附件 */
    downloadFile(row){
      let FileSaver = require('file-saver');
      const url = process.env.VUE_APP_BASE_API + row.ljdz;
      FileSaver.saveAs(url, row.fjmc);
      // downFile(this.url + row.ljdz, row.fjmc);
    },
    showEdit(row) {
      let loadCopy = this.$loading({
        customClass: 'create-isLoading',
        lock: true, // lock的修改符--默认是false
        text: '数据加载中......', // 显示在加载图标下方的加载文案
        spinner: 'el-icon-loading', // 自定义加载图标类名
        background: 'rgb(220 ,220 ,220 ,0)', // 遮罩层颜色
      });
      this.dialogFormVisible = true;


      getNotice(row.noticeId).then(res =>{
        this.form = res.data;
        this.form.jshbj = res.data.jshbj  && res.data.jshbj.split(',');
        this.form.jsqylx = res.data.jsqylx && res.data.jsqylx.split(',');
      }).catch( err =>{
        this.$baseMessage('查询通知公告详情失败', 'error')
      }).finally(_=>{
        loadCopy.close();
      })
    },
    close() {
      this.$refs['form'].resetFields();
      this.dialogFormVisible = false
      this.form = {};
      // this.form = this.$options.data().form
    },

  },
}
</script>
<style lang="scss" scoped>
.gs{
  height: 38px;
  line-height: 38px;
  border-top: 1px dashed #C8C8C8;
  border-bottom: 1px dashed #C8C8C8;
  margin-bottom: 26px;
  .title {
    margin: 0;
    padding-left: 5px;
    padding-right: 10px;
    font-size: 16px;
    line-height: 38px;
    color: #666;
    font-weight: bold;
    height: 38px;
  }
}
.r {
  margin: 0;
  padding-left: 5px;
  padding-right: 10px;
  border-left: solid 6px #f90;
  font-size: 16px;
  line-height: 38px;
  color: #666;
  font-weight: bold;
  height: 38px;
}
.linkA:hover,
.server-table i.el-tooltip:hover {
  cursor: pointer;
  color: #409EFF;
}
::v-deep .el-form {
  .el-row {
    margin: 0!important;
    .el-input__inner, .el-textarea__inner {
      background-color: #ffffff!important;
      //border-color: #ffffff!important;
      color: #000000!important;
    }
    .el-radio {
      .el-radio__inner, .el-radio__inner::after {
        background-color: #ffffff!important;
      }
      .el-radio__input.is-checked .el-radio__inner {
        background: #f90!important;
        border-color: #f90!important;
        color: #000000!important;
      }
      .el-radio__input.is-disabled + span.el-radio__label {
        color: #000000!important;
      }
    }

  }
}
</style>

