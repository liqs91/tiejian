<template>
  <div >
         <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <h1>版本记录</h1>
          </div>
           <div >
             <ul class="timeline">
               <li v-for="(item,index) in list" :key="index">
                 <span><h3 v-text="item.versionNo"></h3></span>
                 <span><p v-text="item.versionType=='1'?'版本类型：监管端':'版本类型：企业端'"></p></span>
                 <span><p v-text="item.cjsj"></p></span>
                 <span><ul v-html="item.versionContent"></ul></span>
               </li>
             </ul>
           </div>
        </el-card>
    </div>
</template>

<script>
import {addVersion, delVersion, listVersion, updateVersion,} from '@/api/system/version'

export default {
  name: 'version',

  data() {
    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 公告表格数据
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [{
        dictValue: "1",
        dictLabel: "监管端",
      }, {
        dictValue: "2",
        dictLabel: "企业端",
      },],
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 1000,
        versionType: 2,
        status: 0,
      },
      // 表单参数
      form: {
        id: null,
        versionNo: null,
        versionType: "",
        versionContent: null,
      },
      // 表单校验
      rules: {
        versionNo: [
          {required: true, message: '版本号不能为空', trigger: 'blur'},
        ],
        versionType: [
          {required: true, message: '版本类型不能为空', trigger: 'change'},
        ],
        status: [
          {required: true, message: '版本状态不能为空', trigger: 'change'},
        ],
        versionContent: [
          {required: true, message: '版本内容不能为空', trigger: 'blur'},
        ]
      },
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_notice_status').then((response) => {
      this.statusOptions = response.data
    })
  },
  methods: {

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
      listVersion(this.queryForm).then((response) => {
        this.list = response.rows
        this.total = response.total
      }).finally(_ => {
        this.loading = false
      })
    },
    // 公告状态字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 公告状态字典翻译
    typeFormat(row) {
      return this.selectDictLabel(this.typeOptions, row.versionType)
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
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      })
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.title = '新增系统版本';
      this.form = {
        id: undefined,
        versionNo: undefined,
        versionType: undefined,
        versionContent: undefined,
        status: '0',
      },
        this.open = true;
    },

    handleSee(row) {
      this.form = row
      this.open = true;
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {

          this.form.versionContent.replace(/<[^>]+>/g,"")
          if (this.form.id != undefined) {


            updateVersion(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
              console.log(response)
            })
          } else {

            addVersion(this.form).then((response) => {

              this.msgSuccess('新增成功')
              this.open = false
              this.getList();
              console.log(response)
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$confirm(
        '是否确认删除公告标题为【' + row.versionNo + '】的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(function () {
        return delVersion(ids)
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
