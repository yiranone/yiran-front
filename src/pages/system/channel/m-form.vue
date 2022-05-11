<template>
  <a-modal :visible="parent.formVisible"
           :title="title"
           :width="550"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="parent.formVisible = false"
           @ok="handleOk">
    <a-form :form="form" :hideRequiredMark="true">
      <a-form-item label="渠道名称" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}" :colon="false">
        <a-input allowClear placeholder="请输入渠道名称"
                 v-decorator="['channelName', {rules:[{required: true, message: '请输入渠道名称'}]}]"/>
      </a-form-item>
      <a-form-item  label="渠道编码" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}"
                   :colon="false">
        <a-input allowClear
                 :disabled="formType != '新增'"
                 v-decorator="['channelCode', {rules: [{required: true, message: '请输入渠道编码'}]}]"/>
      </a-form-item>
      <a-form-item label="有效期" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 16}}"
                   :colon="false">
        <a-date-picker format="YYYY-MM-DD"
                 v-decorator="['expireDate', {rules: [{required: true, message: '请设置渠道有效期'}]}]"/>
      </a-form-item>
      <a-form-item label="渠道状态" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 16}}"
                   :colon="false">
        <a-radio-group :options="statusOptions"
                       v-decorator="['status', {rules: [{required: true, message: '请设置渠道状态'}]}]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import {dataSource as ds} from '../../../services/index'
  import moment from "moment";

  export default {
    name: "ChannelEdit",
    inject: ['parent'],
    data() {
      return {
        form: this.$form.createForm(this, {name: 'ChannelEdit'}),
        statusOptions: [
          {label: '正常', value: '0'},
          {label: '停用', value: '1'},
        ],
        confirmLoading: false,
        roleIds: []
      }
    },

    watch: {
      initialValue(val) {
        if (JSON.stringify(val) != "{}") {
          let obj = {}, keys = [];
          keys = ['channelName', 'channelCode', 'expireDate', 'status']
          keys.forEach(item => {
            obj[item] = val[item] || ''
          })
          this.$nextTick(() => {
            this.form.setFieldsValue({...obj})
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
        return `${this.formType}渠道`
      }
    },

    methods: {
      handleOk(e) {
        e.preventDefault()
        this.form.validateFields(async (err) => {
          if (!err) {
            const conditions = this.form.getFieldsValue()
            this.confirmLoading = true
              ds.channelEdit({
                ...conditions,
                expireDate: moment(conditions["expireDate"]).format("YYYY-MM-DD"),
                channelId: this.initialValue.channelId
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
