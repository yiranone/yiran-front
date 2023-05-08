<template>
  <a-modal :visible="open"
           :title="formTitle"
           :width="700"
           :destroyOnClose="true"
           :confirmLoading="submitLoading"
           @cancel="onClose"
           @ok="submitForm" >
    <a-form-model ref="form" :model="form" :rules="rules"  :label-col="{span:6}" :wrapper-col="{span:16}">
      <a-form-model-item label="字典类型">
        {{form.dictType}}
      </a-form-model-item>
      <a-form-model-item label="数据标签" prop="dictLabel">
        <a-input v-model="form.dictLabel" placeholder="请输入数据标签" />
      </a-form-model-item>
      <a-form-model-item label="数据键值" prop="dictValue">
        <a-input v-model="form.dictValue" placeholder="请输入数据键值" />
      </a-form-model-item>
      <a-form-model-item label="样式" prop="cssClass">
        <a-input v-model="form.cssClass" placeholder="" />
      </a-form-model-item>
      <a-form-model-item label="显示排序" prop="orderNum">
        <a-input-number v-model="form.orderNum" :min="0" style="width: 100%"/>
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

import {dataSource,metadataSource} from '@/services/index'

export default {
  name: 'CreateDataForm',
  props: {
    dictType: {
      type: String,
      required: true
    },
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
      form: {
        dictCode: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        cssClass: undefined,
        orderNum: 0,
        status: '0',
        remark: undefined
      },
      open: false,
      rules: {
        dictLabel: [{ required: true, message: '数据标签不能为空', trigger: 'blur' }],
        dictValue: [{ required: true, message: '数据键值不能为空', trigger: 'blur' }],
        orderNum: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }]
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
      }
    },
     /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.formTitle = '添加字典数据'
      this.form.dictType = this.dictType
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      const dictCode = row.dictCode
      dataSource.dictDataDetail({dictCode:dictCode}).then(response => {
        this.form = response
        this.open = true
        this.formTitle = '修改字典数据'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.dictCode !== undefined) {
            dataSource.dictDataEdit(this.form).then(response => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            dataSource.dictDataAdd(this.form).then(response => {
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
