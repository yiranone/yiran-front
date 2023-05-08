<template>
  <a-modal :visible="open"
           :title="formTitle"
           :width="1200"
           :destroyOnClose="true"
           :confirmLoading="submitLoading"
           @cancel="onClose"
           @ok="submitForm">
    <a-form-model ref="form" :model="form" :rules="rules"  :label-col="{span:4}" :wrapper-col="{span:18}">
      <a-form-model-item label="公告标题" prop="noticeTitle">
        <a-input v-model="form.noticeTitle" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="公告类型" button-style="solid" prop="noticeType">
        <a-radio-group v-model="form.noticeType" button-style="solid">
          <a-radio-button v-for="(d, index) in typeOptions" :key="index" :value="d.value" >{{ d.label }}</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="公告状态" prop="status">
        <a-radio-group v-model="form.status" button-style="solid">
          <a-radio-button v-for="(d, index) in statusOptions" :key="index" :value="d.value" >{{ d.label }}</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
<!--      <a-form-model-item label="公告内容" prop="noticeContent">
        <a-input v-model="form.noticeContent" placeholder="请输入公告内容" type="textarea" allow-clear />
      </a-form-model-item>-->
      <a-form-model-item label="公告内容" prop="noticeContent">
        <editor ref="noticeContentEditor" v-model="form.noticeContent" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>

import {dataSource} from '@/services/index'
import Editor from '@/components/editor'

export default {
  name: 'CreateForm',
  props: {
    typeOptions: {
      type: Array,
      required: true
    },statusOptions: {
      type: Array,
      required: true
    }
  },
  components: {
    Editor
  },
  data () {
    return {
      submitLoading: false,
      formTitle: '',
      // 表单参数
      form: {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        status: undefined
      },
      open: false,
      rules: {
        noticeTitle: [{ required: true, message: '不能为空', trigger: 'blur' }],
        noticeType: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
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
      this.formTitle = '添加公告'
    },
    /** 修改按钮操作 */
    handleUpdate (row, ids) {
      this.reset()
      const noticeId = row ? row.noticeId : ids[0]
      dataSource.noticeDetail({"noticeId":noticeId}).then(data => {
        this.form = data
        this.open = true
        this.formTitle = '修改公告'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          if (this.form.noticeId !== undefined) {
            console.info("修改" + JSON.stringify(this.form))
            dataSource.noticeEdit(this.form).then(data => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            dataSource.noticeAdd(this.form).then(data => {
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
