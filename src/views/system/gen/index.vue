<template>
  <div class="app-container">
    <el-form :model="queryForm" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="表名称" prop="tableName">
        <el-input v-model="queryForm.tableName" placeholder="请输入表名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input v-model="queryForm.tableComment" placeholder="请输入表描述" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button plain type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button plain icon="el-icon-refresh" @click="resetQuery">重置</el-button>

      </el-form-item>
    </el-form>

    <el-button type="back" plain icon="el-icon-download" @click="handleGenTable">生成</el-button>
    <el-button type="warning" plain icon="el-icon-upload" @click="openImportTable">导入</el-button>
    <el-button type="danger" plain icon="el-icon-delete" :disabled="multiple" @click="handleDelete">删除</el-button>
    <br>
    <br>


    <el-table v-loading="loading" border :data="tableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55"/>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ (queryForm.pageNo - 1) * queryForm.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名称" align="center" prop="tableName" :show-overflow-tooltip="true"/>
      <el-table-column label="表描述" align="center" prop="tableComment" :show-overflow-tooltip="true"/>
      <el-table-column label="实体" align="center" prop="className" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button plain type="info"   icon="el-icon-view"
                     @click="handlePreview(scope.row)">预览
          </el-button>
          <el-button plain type="danger"   icon="el-icon-delete"
                     @click="handleDelete(scope.row)">删除
          </el-button>
          <el-button plain type="even"   icon="el-icon-refresh"
                     @click="handleSynchDb(scope.row)">同步
          </el-button>
          <el-button plain type="back"   icon="el-icon-download"
                     @click="handleGenTable(scope.row)">生成代码
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
    <!-- 预览界面 -->
    <el-dialog :title="preview.title" :visible.sync="preview.open" width="80%" top="5vh" append-to-body
               class="scrollbar">
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :label="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
          :name="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
          :key="key"
        >
          <el-link :underline="false" icon="el-icon-document-copy" v-clipboard:copy="value"
                   v-clipboard:success="clipboardSuccess" style="float:right">复制
          </el-link>
          <pre><code class="hljs" v-html="highlightedCode(value, key)"></code></pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <import-table ref="import" @ok="handleQuery"/>
  </div>
</template>

<script>
import {listTable, previewTable, delTable, genCode, synchDb} from "@/api/common/gen";
import importTable from "./importTable";
import hljs from "highlight.js/lib/highlight";
import "highlight.js/styles/github-gist.css";

hljs.registerLanguage("java", require("highlight.js/lib/languages/java"));
hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("html", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("vue", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("javascript", require("highlight.js/lib/languages/javascript"));
hljs.registerLanguage("sql", require("highlight.js/lib/languages/sql"));

export default {
  name: "Gen",
  components: {importTable},
  data() {
    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      // 遮罩层
      loading: true,
      // 唯一标识符
      uniqueId: "",
      // 选中数组
      ids: [],
      // 选中表数组
      tableNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表数据
      tableList: [],
      // 日期范围
      dateRange: "",
      // 查询参数
      queryForm: {
        pageNo: 1,
        pageSize: 50,
        tableName: undefined,
        tableComment: undefined
      },
      // 预览参数
      preview: {
        open: false,
        title: "代码预览",
        data: {},
        activeName: "domain.java"
      }
    };
  },
  created() {
    this.getList();
  },
  activated() {
    const time = this.$route.query.t;
    if (time != null && time != this.uniqueId) {
      this.uniqueId = time;
      this.queryForm.pageNo = Number(this.$route.query.pageNo);
      this.getList();
    }
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

    /** 查询表集合 */
    getList() {
      this.loading = true;
      listTable(this.addDateRange(this.queryForm, this.dateRange)).then(response => {
          this.tableList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryForm.pageNo = 1;
      this.getList();
    },
    /** 生成代码操作 */
    handleGenTable(row) {
      const tableNames = row.tableName || this.tableNames;
      if (tableNames == "") {
        this.msgError("请选择要生成的数据");
        return;
      }
      if (row.genType === "1") {
        genCode(row.tableName).then(response => {
          this.$baseMessage("成功生成到自定义路径：" + row.genPath);
        });
      } else {
        this.zip("/tool/gen/batchGenCode?tables=" + tableNames, "tiejian.zip");
        this.getList()
      }
    },


    /** 同步数据库操作 */
    handleSynchDb(row) {
      const tableName = row.tableName;
      this.$baseConfirm('确认要强制同步"' + tableName + '"表结构吗？', "into").then(function () {
        return synchDb(tableName);
      }).then(() => {
        this.$modal.msgSuccess("同步成功");
      }).catch(() => {
      });
    },
    /** 打开导入表弹窗 */
    openImportTable() {
      this.$refs.import.show();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 预览按钮 */
    handlePreview(row) {
      previewTable(row.tableId).then(response => {
        this.preview.data = response.data;
        this.preview.open = true;
        this.preview.activeName = "domain.java";
      });
    },
    /** 高亮显示 */
    highlightedCode(code, key) {
      const vmName = key.substring(key.lastIndexOf("/") + 1, key.indexOf(".vm"));
      var language = vmName.substring(vmName.indexOf(".") + 1, vmName.length);
      const result = hljs.highlight(language, code || "", true);
      return result.value || '&nbsp;';
    },
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$baseMessage("复制成功");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.tableId);
      this.tableNames = selection.map(item => item.tableName);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleEditTable(row) {
      const tableId = row.tableId || this.ids[0];
      const tableName = row.tableName || this.tableNames[0];
      const params = {pageNo: this.queryForm.pageNo};
      //  this.$tab.openPage("修改[" + tableName + "]生成配置", '/tool/gen-edit/index/' + tableId, params);
    },


    handleDelete(row) {
      const tableIds = row.tableId || this.ids;
      if (tableIds) {
        this.$baseConfirm('你确定要删除当前项吗', "info", async () => {
          const {msg} = await delTable(tableIds)
          this.$baseMessage(msg, 'success', 'vab-hey-message-success')
          await this.getList()
        })
      }
    },

  }
};
</script>
