<template>
  <a-modal :visible="open"
                   :title="formTitle"
                   :width="700"
                   :destroyOnClose="true"
                   :confirmLoading="submitLoading"
                   @cancel="onClose"
                   @ok="submitForm" >
    <a-form-model ref="form" :model="form" :rules="rules"  :label-col="{span:6}" :wrapper-col="{span:16}">
      <a-form-model-item label="字典名称" prop="dictName">
        <a-input v-model="form.dictName" placeholder="请输入字典名称" />
      </a-form-model-item>
      <a-form-model-item label="字典类型" prop="dictType">
        <a-input v-model="form.dictType" placeholder="请输入字典类型" />
      </a-form-model-item>
      <a-form-model-item label="状态" prop="status">
        <a-select placeholder="请选择" v-model="form.status">
          <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.value" >{{ d.label }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remark">
        <a-input v-model="form.remark" placeholder="请输入内容" type="textarea" allow-clear />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>

import {dataSource} from '@/services/index'

export default {
  name: 'CreateForm',
  props: {
    statusOptions: {
      type: Array,
      required: true
    }
  },
  components: {
  },
  data () {
    return {
      submitLoading: false,
      formTitle: '',
      // 表单参数
      form: {},
      open: false,
      rules: {
        dictName: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
        dictType: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }]
      }
    }
  },
  filters: {
  },
  created () {
  },
  computed: {
  },
  watch: {
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
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: '1',
        remark: undefined
      }
    },
     /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.formTitle = '添加字典类型'
    },
    /** 修改按钮操作 */
    handleUpdate (row, ids) {
      this.reset()
      const dictId = row ? row.dictId : ids[0]
      dataSource.dictDetail({dictId:dictId}).then(data => {
        this.form = data
        this.open = true
        this.formTitle = '修改字典类型'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.dictId !== undefined) {
            dataSource.dictEdit(this.form).then(response => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            dataSource.dictAdd(this.form).then(data => {
              this.$message.success('新增成功')
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
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
