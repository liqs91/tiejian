<template>
  <div class="app-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-form :model="queryForm" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item label="" prop="configName">
            <el-input
              v-model="queryForm.configName"
              placeholder="请输入参数类型名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="" prop="configType">
            <el-input
              v-model="queryForm.configType"
              placeholder="请输入参数类型值"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" plain @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>

      <vab-query-form-right-panel :span="12">
        <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd"
                   v-hasPermi="['watch:config:add']">新增
        </el-button>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="loading" border :data="list" @selection-change="handleSelectionChange">
      <el-table-column label="参数类型名称" align="center" prop="configName" width="200"/>
      <el-table-column label="参数类型值" align="center" prop="configType" width="120"/>
      <el-table-column label="模块编号" align="center" prop="configKey" width="200"/>
      <el-table-column label="参数值" align="center" prop="configValue" width="120"/>
      <el-table-column label="备注说明" align="center" prop="remark"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['watch:config:edit']">修改
          </el-button>
          <el-button size="mini" type="back" icon="el-icon-s-promotion">发送指令</el-button>
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


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="参数类型名称" prop="configName">
          <el-input v-model="form.configName" placeholder="请输入参数类型名称"/>
        </el-form-item>
        <el-form-item label="参数类型值" prop="configType">
          <el-input v-model="form.configType" placeholder="请输入参数类型值"/>
        </el-form-item>
        <el-form-item label="模块编号" prop="configKey">
          <el-input v-model="form.configKey" placeholder="请输入模块编号"/>
        </el-form-item>
        <el-form-item label="参数值" prop="configValue">
          <el-input v-model="form.configValue" placeholder="请输入参数键值"/>
        </el-form-item>
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注说明"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addConfig, getConfig, listConfig, updateConfig} from "@/api/service/config";

export default {
  name: "Config",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 参数配置表格数据
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      total: 0,
      layout: 'total, sizes, prev, pager, next, jumper',
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        configName: null,
        configKey: null,
        configValue: null,
        configType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
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
    /** 查询参数配置列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryForm).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        configId: null,
        configName: null,
        configKey: null,
        configValue: null,
        configType: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    //搜索按钮操作
    handleQuery() {
      this.queryForm.pageNo = 1;
      this.getList();
    },
    //重置按钮操作
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.configId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //新增按钮操作
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加参数配置";
    },
    //修改按钮操作
    handleUpdate(row) {
      this.reset();
      const configId = row.configId || this.ids
      getConfig(configId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改参数配置";
      });
    },



    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.configId != null) {
            updateConfig(this.form).then(response => {
              this.$baseMessage("修改成功", 'success')
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then(response => {
              this.$baseMessage("新增成功", 'success');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  }
};
</script>
