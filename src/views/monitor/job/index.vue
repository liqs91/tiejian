<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" label-width="68px" :model="queryForm">
      <el-form-item label="任务名称" prop="jobName">
        <el-input v-model="queryForm.jobName" clearable placeholder="请输入任务名称" size="small"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
<!--      <el-form-item label="任务组名" prop="jobGroup">-->
<!--        <el-select v-model="queryForm.jobGroup" clearable placeholder="请选择任务组名" size="small">-->
<!--          <el-option v-for="dict in jobGroupOptions"-->
<!--                     :key="dict.dictValue"-->
<!--                     :label="dict.dictLabel"-->
<!--                     :value="dict.dictValue"/>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="任务状态" prop="status">
        <el-select v-model="queryForm.status" clearable placeholder="请选择任务状态" size="small">
          <el-option v-for="dict in statusOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search"  plain type="primary" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" plain  @click="resetQuery">
          重置
        </el-button>

      </el-form-item>
    </el-form>
    <el-button v-hasPermi="['monitor:job:add']" icon="el-icon-plus" plain type="primary" @click="handleAdd">
      新增
    </el-button>
    <br>
    <br>


    <el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange" border>
      <el-table-column align="center" label="任务编号" prop="jobId" width="100"/>
      <el-table-column align="center" label="任务名称" prop="jobName"  width="300"/>
<!--      <el-table-column align="center" :formatter="jobGroupFormat" label="任务组名" prop="jobGroup"/>-->
      <el-table-column align="center" label="调用目标字符串" prop="invokeTarget"  />
      <el-table-column align="center" label="cron执行表达式" prop="cronExpression" width="200" />
      <el-table-column align="center" label="状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="240">
        <template slot-scope="scope">
          <el-button plain v-hasPermi="['monitor:job:changeStatus']" icon="el-icon-caret-right" size="mini" type="back"
                     @click="handleRun(scope.row)">
            执行一次
          </el-button>


          <el-button plain v-hasPermi="['monitor:job:edit']"   icon="el-icon-edit" size="mini" type="primary"
                     @click="handleUpdate(scope.row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0"
                :limit.sync="queryForm.pageSize"
                :page.sync="queryForm.pageNo"
                :total="total"
                @pagination="getList"
    />

    <!-- 新增或修改定时任务对话框 -->
    <el-dialog append-to-body :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" label-width="150px" :model="form" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入任务名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="请选择">
                <el-option v-for="dict in jobGroupOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="invokeTarget">
              <span slot="label">
                调用方法
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean调用示例：ryTask.ryParams('ry')
                    <br/>
                    Class类调用示例：com.ledao.quartz.task.RyTask.ryParams('ry')
                    <br/>
                    参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.invokeTarget" placeholder="请输入调用目标字符串"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发" prop="concurrent">
              <el-radio-group v-model="form.concurrent" size="small">
                <el-radio-button label="0">
                  允许
                </el-radio-button>
                <el-radio-button label="1">
                  禁止
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="错误策略" prop="misfirePolicy">
              <el-radio-group v-model="form.misfirePolicy" size="small">
                <el-radio-button label="1">
                  立即执行
                </el-radio-button>
                <el-radio-button label="2">
                  执行一次
                </el-radio-button>
                <el-radio-button label="3">
                  放弃执行
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue">
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 任务日志详细 -->
    <el-dialog append-to-body title="任务详细" :visible.sync="openView" width="700px">
      <el-form ref="form" label-width="120px" :model="form" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号：">
              {{ form.jobId }}
            </el-form-item>
            <el-form-item label="任务名称：">
              {{ form.jobName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">
              {{ jobGroupFormat(form) }}
            </el-form-item>
            <el-form-item label="创建时间：">
              {{ form.createTime }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式：">
              {{ form.cronExpression }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次执行时间：">
              {{ parseTime(form.nextValidTime) }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用目标方法：">
              {{ form.invokeTarget }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态：">
              <div v-if="form.status == 0">
                正常
              </div>
              <div v-else-if="form.status == 1">
                失败
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发：">
              <div v-if="form.concurrent == 0">
                允许
              </div>
              <div v-else-if="form.concurrent == 1">
                禁止
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行策略：">
              <div v-if="form.misfirePolicy == 0">
                默认策略
              </div>
              <div v-else-if="form.misfirePolicy == 1">
                立即执行
              </div>
              <div v-else-if="form.misfirePolicy == 2">
                执行一次
              </div>
              <div v-else-if="form.misfirePolicy == 3">
                放弃执行
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listJob,
  getJob,
  delJob,
  addJob,
  updateJob,
  exportJob,
  runJob,
  changeJobStatus,
} from '@/api/monitor/job'

export default {
  name: 'Job',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 定时任务表格数据
      jobList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      // 任务组名字典
      jobGroupOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 30,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [
          {required: true, message: '任务名称不能为空', trigger: 'blur'},
        ],
        invokeTarget: [
          {
            required: true,
            message: '调用目标字符串不能为空',
            trigger: 'blur',
          },
        ],
        cronExpression: [
          {
            required: true,
            message: 'cron执行表达式不能为空',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_job_group').then((response) => {
      this.jobGroupOptions = response.data
    })
    this.getDicts('sys_job_status').then((response) => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true
      listJob(this.queryForm).then((response) => {
        this.jobList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 任务组名字典翻译
    // eslint-disable-next-line no-unused-vars
    jobGroupFormat(row, column) {
      return this.selectDictLabel(this.jobGroupOptions, row.jobGroup)
    },
    // 状态字典翻译
    // eslint-disable-next-line no-unused-vars
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        jobId: undefined,
        jobName: undefined,
        jobGroup: undefined,
        invokeTarget: undefined,
        cronExpression: undefined,
        misfirePolicy: 1,
        concurrent: 1,
        status: '0',
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryForm.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.jobId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 任务状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm(
        '确认要"' + text + '""' + row.jobName + '"任务吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return changeJobStatus(row.jobId, row.status)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function () {
          row.status = row.status === '0' ? '1' : '0'
        })
    },
    /* 立即执行一次 */
    handleRun(row) {
      this.$confirm(
        '确认要立即执行一次"' + row.jobName + '"任务吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return runJob(row.jobId, row.jobGroup)
        })
        .then(() => {
          this.msgSuccess('执行成功')
        })
        .catch(() => {
        })
    },
    /** 任务详细信息 */
    handleView(row) {
      getJob(row.jobId).then((response) => {
        this.form = response.data
        this.openView = true
      })
    },
    /** 任务日志列表查询 */
    handleJobLog() {
      this.$router.push('/job/log')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '新增任务'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const jobId = row.jobId || this.ids
      getJob(jobId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改任务'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.jobId != undefined) {
            // eslint-disable-next-line no-unused-vars
            updateJob(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            // eslint-disable-next-line no-unused-vars
            addJob(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobIds = row.jobId || this.ids
      this.$confirm(
        '是否确认删除定时任务编号为"' + jobIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delJob(jobIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(() => {
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryForm = this.queryForm
      this.$confirm('是否确认导出所有定时任务数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.exportLoading = true
          return exportJob(queryForm)
        })
        .then((response) => {
          this.download(response.msg)
          this.exportLoading = false
        })
        .catch(() => {
        })
    },
  },
}
</script>
