<template>
  <div class="app-container">
    <vab-query-form>

      <vab-query-form-left-panel :span="12">

        <el-form :model="queryForm" ref="queryForm" size="small" :inline="true" v-show="showSearch">
          <el-form-item label="" prop="postCode">
            <el-input
              v-model="queryForm.postCode"
              placeholder="请输入岗位编码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="" prop="postName">
            <el-input
              v-model="queryForm.postName"
              placeholder="请输入岗位名称"
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
        <el-button v-hasPermi="['system:post:add']" plain icon="el-icon-plus" type="primary" @click="handleAdd">新增
        </el-button>
<!--        <el-button v-hasPermi="['system:post:export']" plain icon="el-icon-report" type="warning" @click="handleExport">导出</el-button>-->
      </vab-query-form-right-panel>

    </vab-query-form>



    <el-table v-loading="loading" border :data="postList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" width="70" align="center"/>
      <el-table-column label="岗位编码" align="center" prop="postCode"/>
      <el-table-column label="岗位名称" align="center" prop="postName"/>
      <el-table-column label="显示顺序" align="center" prop="postSort"/>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="even"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryForm.pageNo"
      :limit.sync="queryForm.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改岗位信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入岗位编码"/>
        </el-form-item>
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称"/>
        </el-form-item>
        <el-form-item label="显示顺序" prop="postSort">
          <el-input v-model="form.postSort" placeholder="请输入显示顺序"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
import {listPost, getPost, delPost, addPost, updatePost} from "@/api/system/post";

export default {
  name: "Post",
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
      // 总条数
      total: 0,
      // 岗位信息表格数据
      postList: [],
      statusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        postCode: null,
        postName: null,
        postSort: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        postCode: [
          {required: true, message: "岗位编码不能为空", trigger: "blur"}
        ],
        postName: [
          {required: true, message: "岗位名称不能为空", trigger: "blur"}
        ],
        postSort: [
          {required: true, message: "显示顺序不能为空", trigger: "blur"}
        ],
        status: [
          {required: true, message: "状态不能为空", trigger: "change"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },

    /** 查询岗位信息列表 */
    getList() {
      this.loading = true;
      listPost(this.queryForm).then(response => {
        this.postList = response.rows;
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
        postId: null,
        postCode: null,
        postName: null,
        postSort: null,
        status: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryForm.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加岗位信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const postId = row.postId || this.ids
      getPost(postId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改岗位信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.postId != null) {
            updatePost(this.form).then(response => {
               this.$baseMessage("修改成功", 'success')

              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then(response => {
              this.$baseMessage("新增成功", 'success')
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.postId || this.ids;
      this.$confirm('是否确认删除岗位信息编号为"' + postIds + '"的数据项？').then(function () {
        return delPost(postIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/post/export', {
        ...this.queryForm
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
