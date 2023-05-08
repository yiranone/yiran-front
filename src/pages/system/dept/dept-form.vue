<template>
  <a-modal :visible="open"
           :title="formTitle"
           :width="650"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="open = false"
           @ok="submitForm">
    <a-form-model ref="form" :model="form" :rules="rules"  :label-col="{span:6}" :wrapper-col="{span:16}">
      <a-form-model-item label="上级目录" prop="parentId">
        <a-tree-select
            v-model="form.parentId"
            :tree-data="treeData"
            placeholder="请选择上级目录"
            :replaceFields="replaceFields"
            :treeExpandedKeys.sync="treeExpandedKeys"
            allowClear/>
      </a-form-model-item>
      <a-form-model-item label="部门名称" prop="deptName">
        <a-input v-model="form.deptName" placeholder="请输入部门名称" />
      </a-form-model-item>
      <a-form-model-item label="部门编码" prop="deptCode">
        <a-input v-model="form.deptCode" placeholder="请输入部门编码" />
      </a-form-model-item>
      <a-form-model-item label="显示排序" prop="orderNum">
        <a-input v-model="form.orderNum" placeholder="请输入显示排序" />
      </a-form-model-item>
      <a-form-model-item label="显示状态" prop="visible">
        <a-radio-group v-model="form.status" button-style="solid">
          <a-radio-button v-for="(d, index) in statusOptions" :key="index" :value="d.value" >{{ d.label }}</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {dataSource} from '@/services'

export default {
  name: "dept-form",
  props: {
    allDepts: [],
  },
  data() {
    return {
      form: {},
      formTitle: '',
      confirmLoading: false,
      open: false,
      rules: {
        parentId: [{ required: true, message: '上级目录不能为空', trigger: 'blur' }],
        deptName: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        deptCode: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
        orderNum: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
      },
      replaceFields: {
        key: 'deptId',
        value: 'deptId',
        title: 'deptName'
      },
      statusOptions: this.$store.getters.system_normal_disable,
      treeExpandedKeys: [1],
    }
  },

  computed: {
    treeData() {
      return [
        {
          deptId: 0,
          parentId: 0,
          deptName: '根目录',
          children: this.allDepts
        },
      ]
    }
  },

  methods: {
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
      this.form = {
      }
    },
    handleAdd (record) {
      this.reset()
      if(record != null) {
        this.form.parentId = record.deptId
      }
      this.open = true
      this.formTitle = '新增部门'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      this.form = row
      this.open = true
      this.formTitle = '修改部门'
    },

    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.deptId !== undefined) {
            dataSource.deptEdit(this.form).then(data => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.confirmLoading = false
            })
          } else {
            dataSource.deptAdd(this.form).then(data => {
              this.$message.success('新增成功')
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.confirmLoading = false
            })
          }
        }
      })
    },

  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-input-number {
  width: 100%;
}
</style>
