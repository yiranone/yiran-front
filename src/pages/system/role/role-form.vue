<template>
  <a-modal :visible="open"
           :title="formTitle"
           :width="800"
           :destroyOnClose="true"
           @cancel="open = false">
    <template slot="footer">
      <div class="bottom-control">
        <a-space>
          <a-button type="dashed" @click="cancel">
            取消
          </a-button>
<!--          <a-button type="primary" :loading="confirmLoading" @click="submitForm">
            保存
          </a-button>-->
          <a-button type="primary" :loading="confirmLoading" @click="submitForm">
            确认
          </a-button>
        </a-space>
      </div>
    </template>
    <a-form-model ref="form" :model="form" :rules="rules"  :label-col="{span:6}" :wrapper-col="{span:16}">
      <a-form-model-item label="角色名称" prop="roleName">
        <a-input v-model="form.roleName" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item prop="roleKey">
        <span slot="label">
          权限字符
          <a-tooltip>
            <template slot="title">
              控制器中定义的权限字符，如：@RequiresPermission("system:user:view")
            </template>
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input v-model="form.roleKey" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="排序" prop="roleSort">
        <a-input-number placeholder="请输入" v-model="form.roleSort" :min="0" style="width: 100%"/>
      </a-form-model-item>
      <a-form-model-item label="状态" prop="status">
        <a-radio-group v-model="form.status" button-style="solid">
          <a-radio-button v-for="(d, index) in this.$store.getters.system_normal_disable" :key="index" :value="d.value" >{{ d.label }}</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="菜单权限">
        <a-checkbox @change="handleCheckedTreeExpand($event)">
          展开一层/折叠
        </a-checkbox>
        <a-checkbox @change="handleCheckedTreeNodeAll($event)">
          全选/全不选
        </a-checkbox>
        <a-checkbox @change="handleCheckedTreeConnect($event)" :checked="form.menuCheckStrictly">
          父子联动
        </a-checkbox>
        <a-tree
            v-model="menuCheckedKeys"
            checkable
            :checkStrictly="!form.menuCheckStrictly"
            :expanded-keys="menuExpandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="menuOptions"
            @check="onCheck"
            @expand="onExpandMenu"
            :replaceFields="defaultProps"
        />
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remark">
        <a-input v-model="form.remark" placeholder="请输入" type="textarea" allow-clear />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {dataSource, metadataSource} from '@/services/index'
export default {
  name: "role-form",
  props: {
  },
  components: {
  },
  data() {
    return {
      confirmLoading: false,
      menuExpandedKeys: [],
      autoExpandParent: false,
      menuCheckedKeys: [],
      halfCheckedKeys: [],
      menuOptions: [],
      formTitle: '',
      // 表单参数
      form: {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: '0',
        menuIds: [],
        menuCheckStrictly: true,
        remark: undefined
      },
      open: false,
      menuExpand: false,
      menuNodeAll: false,
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
        roleSort: [{ required: true, message: '显示顺序不能为空', trigger: 'blur' }]
      },
      defaultProps: {
        children: 'children',
        title: 'name',
        key: 'menuId'
      }
    }
  },
  watch: {
  },
  created() {
  },

  computed: {
  },

  methods: {
    onExpandMenu (expandedKeys) {
      this.menuExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    /** 查询菜单树结构 */
    getMenuTreeselect () {
      metadataSource.permTree().then(data => {
        this.menuOptions = data
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys () {
      // 全选与半选
      return this.menuCheckedKeys.concat(this.halfCheckedKeys)
    },
    getAllMenuNode (nodes) {
      if (!nodes || nodes.length === 0) {
        return []
      }
      nodes.forEach(node => {
        this.menuCheckedKeys.push(node.menuId)
        return this.getAllMenuNode(node.children)
      })
    },
    selectNodefilter2 (allCheckedKeys, node) {
      // 父子关联模式且当前元素有父级
      if (node.children != null && node.children.length > 0) {
        node.children.forEach(e => {
          this.selectNodefilter2(allCheckedKeys, e)
        })
        let checkSize = 0
        node.children.forEach(e => {
          if(this.menuCheckedKeys.indexOf(e.menuId) > 0) {
            checkSize ++
          }
        })
        if (checkSize == node.children.length) {
          const isExist = this.menuCheckedKeys.indexOf(node.menuId)
          if (isExist == -1) {
            this.menuCheckedKeys.push(node.menuId);
          }
        } else if (checkSize > 0){
          const isExist = this.halfCheckedKeys.indexOf(node.menuId)
          if(isExist == -1) {
            this.halfCheckedKeys.push(node.menuId);
          }
        }
      } else {
        const isExist = this.menuCheckedKeys.indexOf(node.menuId)
        const isChecked = allCheckedKeys.indexOf(node.menuId)
        if (isExist == -1 && isChecked > -1) {
          this.menuCheckedKeys.push(node.menuId);
        }
      }
    },
    handleCheckedTreeNodeAll (value) {
      if (value.target.checked) {
        this.getAllMenuNode(this.menuOptions)
      } else {
        this.menuCheckedKeys = []
        this.halfCheckedKeys = []
      }
    },
    handleCheckedTreeExpand (value) {
      if (value.target.checked) {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.menuExpandedKeys.push(treeList[i].menuId)
        }
      } else {
        this.menuExpandedKeys = []
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect (value) {
      this.form.menuCheckStrictly = !this.form.menuCheckStrictly
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect (roleId) {
      return metadataSource.permTree({roleId:roleId}).then(data => {
        this.menuOptions = data
        return data
      })
    },
    onCheck (checkedKeys, info) {
      if (!this.form.menuCheckStrictly) {
        let currentCheckedKeys = []
        if (this.menuCheckedKeys.checked) {
          currentCheckedKeys = currentCheckedKeys.concat(this.menuCheckedKeys.checked)
        }
        if (this.menuCheckedKeys.halfChecked) {
          currentCheckedKeys = currentCheckedKeys.concat(this.menuCheckedKeys.halfChecked)
        }
        this.menuCheckedKeys = currentCheckedKeys
      } else {
        // 半选节点
        this.halfCheckedKeys = info.halfCheckedKeys
        this.menuCheckedKeys = checkedKeys
      }
    },
    onClose () {
      this.open = false
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      if (this.$refs.menu !== undefined) {
        this.menuCheckedKeys = []
        this.halfCheckedKeys = []
      }
      this.menuExpand = false
      this.menuNodeAll = false
      this.menuExpandedKeys = []
      this.autoExpandParent = false
      this.menuCheckedKeys = []
      this.halfCheckedKeys = []
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: '0',
        menuIds: [],
        menuCheckStrictly: true,
        remark: undefined
      }
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.getMenuTreeselect()
      this.open = true
      this.formTitle = '添加角色'
    },
    /** 修改按钮操作 */
    handleUpdate (row, ids) {
      this.reset()
      const roleId = row ? row.roleId : ids[0]
      const roleMenu = this.getRoleMenuTreeselect(roleId)
      dataSource.roleDetail({roleId:roleId}).then(data => {
        if(data.menuCheckStrictly == null )
          data.menuCheckStrictly = true;
        this.form = data
        this.open = true
        this.$nextTick(() => {
          roleMenu.then(res => {
            // 过滤回显时的半选中node(父)
            if (this.form.menuCheckStrictly) {
              // this.menuCheckedKeys = [2026]
              this.menuOptions.forEach(e => {
                this.selectNodefilter2(data.menuIds, e)
              })
            } else {
              this.menuCheckedKeys = data.menuIds
            }
          })
        })
        this.formTitle = '修改角色'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.form.roleId !== undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            dataSource.roleEdit(this.form).then(response => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.confirmLoading = false
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            dataSource.roleAdd(this.form).then(response => {
              this.$message.success('新增成功')
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.confirmLoading = false
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
