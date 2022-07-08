<template>
  <a-modal :visible="parent.formVisible"
           :title="title"
           :width="1000"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="parent.formVisible = false"
           @ok="handleOk">
    <a-form :form="form" :hideRequiredMark="true">
      <a-row class="form-row">
        <a-col :md="12">
          <a-form-item label="手机号" :label-col="{span:8}" :wrapper-col="{span:16}">
            <a-input allowClear placeholder="请输入手机号"
                     :disabled="formType != '新增'"
                     v-decorator="['phone', {rules:[{required: true, message: '请输入手机号'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12">
          <a-form-item label="会员名称" :label-col="{span:8}" :wrapper-col="{span:16}">
            <a-input :maxLength="32" allowClear placeholder="请输入会员名称"
                     v-decorator="['name', {rules: [{required: true, message: '请输入会员名称'}]}]"/>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item v-if="formType != '编辑'" :label="`${formType == '新增'? '登录' : '重置'}密码`" :labelCol="{sm: {span: 4}}"
                   :wrapperCol="{sm: {span: 20}}" :colon="false">
        <a-input-password allowClear placeholder="请输入登录密码"
                          v-decorator="['password', {rules: [{required: true, message: '请输入登录密码'}]}]"/>
      </a-form-item>
      <a-form-item v-if="formType != '重置'" label="会员状态" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 16}}"
                   :colon="false">
        <a-radio-group :options="statusOptions"
                       v-decorator="['status', {rules: [{required: true, message: '请设置会员状态'}]}]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import {dataSource as ds} from '@/services/index'

  export default {
    name: "member-from",
    inject: ['parent'],
    data() {
      return {
        form: this.$form.createForm(this, {name: 'mform'}),
        statusOptions: [
          {label: '正常', value: '0'},
          {label: '停用', value: '1'},
        ],
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
        return `${this.formType}会员`
      }
    },

    methods: {
      handleOk(e) {
        e.preventDefault()
        this.form.validateFields(async (err) => {
          if (!err) {
            const conditions = this.form.getFieldsValue()
            this.confirmLoading = true
            ds.memberEdit({
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
