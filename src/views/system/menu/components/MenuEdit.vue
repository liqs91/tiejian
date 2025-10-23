<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="50%" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="上级菜单" prop="parentId">
            <treeselect v-model="form.parentId" :options="menuOptions" :normalizer="normalizer" :show-count="true"
                        placeholder="选择上级菜单"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="form.menuType">
              <el-radio label="M">目录</el-radio>
              <el-radio label="C">菜单</el-radio>
              <el-radio label="F">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.menuType !== 'F'">
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
            <el-popover popper-class="icon-selector-popper" trigger="hover" width="292">
              <template #reference>
                <el-button>
                  <vab-icon :icon="form.icon"/>
                  图标选择器
                  <vab-icon icon="arrow-down-s-line"/>
                </el-button>
              </template>
              <vab-icon-selector @handle-icon="handleIcon"/>
            </el-popover>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标代码" prop="icon">
            <el-input v-model="form.icon" readonly/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input type="number" v-model="form.orderNum" controls-position="right" :min="0"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 'F'" label="是否外链">
            <el-radio-group v-model="form.isFrame">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 'F'" label="路由名称" prop="path">
            <el-input v-model="form.path" placeholder="请输入路由名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 'C'">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="form.component" placeholder="请输入组件路径"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 'M'" label="权限标识">
            <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 'F'" label="显示状态">
            <el-radio-group v-model="form.visible">
              <el-radio v-for="dict in visibleOptions"
                        :key="dict.dictValue"
                        :label="dict.dictValue">
                {{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 'F'" label="菜单状态">
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
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {listMenu, addMenu, updateMenu} from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import VabIconSelector from "@/extra/VabIconSelector";

export default {
  name: 'Edit',
  components: {Treeselect, VabIconSelector},

  data() {
    return {
      title: '',
      dialogFormVisible: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      form: {
        menuId: null,
        parentId: 0,
        menuName: null,
        icon: "",
        menuType: "M",
        orderNum: null,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0"
      },
      // 表单校验
      rules: {
        menuName: [{required: true, message: "菜单名称不能为空", trigger: "blur"}],
        parentId: [{required: true, message: "上级菜单不能为空", trigger: "change"}],
        orderNum: [{required: true, message: "菜单顺序不能为空", trigger: "blur"}],
        icon: [{required: true, message: "请选择菜单图标", trigger: "change"}],
        path: [{required: true, message: "路由名称不能为空", trigger: "blur"}],
        component: [{required: true, message: "组件路径不能为空", trigger: "blur"}]
      },
    }
  },
  created() {
    this.getDicts("sys_show_hide").then(response => {
      this.visibleOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getTreeselect()
  },
  methods: {

    handleIcon(item) {
      this.form.icon = item

    },
    // 表单重置
    reset() {
      this.form = {
        menuId: null,
        parentId: "0",
        menuName: null,
        icon: "",
        menuType: "M",
        orderNum: null,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0"
      };
      this.resetForm("form");
    },
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    // 显示状态字典翻译
    visibleFormat(row) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.visibleOptions, row.visible);
    },
    // 菜单状态字典翻译
    statusFormat(row) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = {menuId: 0, menuName: '主类目', children: []};
        menu.children = this.handleTree(response.data, "menuId");
        this.menuOptions.push(menu);
      });
    },
    getParentID(res) {
      this.form.parentId = res
      this.getTreeselect();
    },
    showEdit(row) {
      if (!row) {
        this.title = '新增'
        console.log(JSON.stringify(this.form))
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }
      this.dialogFormVisible = true
    },
    close() {
      this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.dialogFormVisible = false
    },
    save() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (!this.form.menuId) {
            addMenu(this.form).then(response => {
              if (response.code == 200) {
                this.$baseMessage("新增成功", 'success')
                this.$emit('fetch-data')
                this.close()
              } else {
                this.$baseMessage(response.msg, 'error')
              }
            });
          } else {
            updateMenu(this.form).then(response => {
              if (response.code == 200) {
                this.$baseMessage("编辑成功", 'success')
                this.$emit('fetch-data')
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
