<template>
  <a-modal :visible="parent.resetPasswordFormVisible"
           :title="title"
           :width="1000"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="parent.resetPasswordFormVisible = false"
           @ok="handleOk">
    <a-form :form="form" :hideRequiredMark="true">

      <a-form-item label="手机号" :label-col="{span:4}" :wrapper-col="{span:8}">
        <a-input allowClear :disabled=true v-decorator="['phone']"/>
      </a-form-item>

      <a-form-item  :label="`重置登录密码`" :labelCol="{sm: {span: 4}}"
                   :wrapperCol="{sm: {span: 8}}" :colon="false">
        <a-input-password allowClear placeholder="请输入登录密码"
                          v-decorator="['password', {rules: [{required: true, message: '请输入登录密码'}]}]"/>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script>
  import {dataSource as ds} from '@/services/index'

  export default {
    name: "member-password-from",
    inject: ['parent'],
    data() {
      return {
        form: this.$form.createForm(this, {name: 'mform'}),
        confirmLoading: false
      }
    },

    watch: {
      initialValue(val) {
        if (JSON.stringify(val) != "{}") {
          this.$nextTick(() => {
            this.form.setFieldsValue({...val})
          })
        }
      }
    },

    computed: {
      initialValue() {
        return this.parent.initialValue
      },
      formType() {
        return this.parent.formType
      },
      title() {
        return `重置会员密码`
      }
    },

    methods: {
      handleOk(e) {
        e.preventDefault()
        this.form.validateFields(async (err) => {
          if (!err) {
            const conditions = this.form.getFieldsValue()
            this.confirmLoading = true
            ds.memberResetPassword({
              ...conditions,
              memberId: this.initialValue.memberId
            }, this.formType).then(res => {
              this.confirmLoading = false
              this.$emit('success', {...res})
            }).catch(res => {
              this.confirmLoading = false
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
