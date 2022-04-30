<template>
  <a-modal :visible="parent.formVisible"
           :title="title"
           :width="550"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="parent.formVisible = false"
           @ok="handleOk">
    <a-form :form="form" :hideRequiredMark="true" :colon="false">
      <a-form-item label="权限名称" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}" >
        <a-input allowClear placeholder="请输入权限名称"
                 v-decorator="['permName', {rules:[{required: true, message: '请输入权限名称'}]}]"/>
      </a-form-item>
      <a-form-item label="权限组" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}" >
        <a-input allowClear placeholder="请输入权限组"
                 v-decorator="['permGroup', {rules: [{required: true, message: '请输入权限组'}]}]"/>
      </a-form-item>
      <a-form-item label="权限字符" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}" >
        <a-input allowClear placeholder="请输入权限字符"
                 v-decorator="['permOperation', {rules: [{required: true, message: '请输入权限字符'}]}]"/>
      </a-form-item>
      <a-form-item label="显示顺序" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}" >
        <a-input-number allowClear placeholder="请设置显示顺序"
                        v-decorator="['permSort', {rules: [{required: true, message: '请设置显示顺序'}]}]"/>
      </a-form-item>
      <a-form-item label="状态" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 16}}">
        <a-radio-group :options="statusOptions"
                       v-decorator="['status', {rules: [{required: true, message: '请设置状态'}]}]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import {userService as us} from '../../../services/index'

  export default {
    name: "m-form",
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
          let obj = {}, keys = [];
          keys = ['permName', 'permGroup', 'permOperation', 'permSort', 'status']
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
        return `${this.formType}权限`
      }
    },

    methods: {
      handleOk(e) {
        e.preventDefault()
        this.form.validateFields((err) => {
          if (!err) {
            const conditions = this.form.getFieldsValue()
            if (this.confirmLoading) return;
            this.confirmLoading = true
            us.permAddOrEditor({
              ...conditions,
              permId: this.formType === '新增' ? undefined : this.initialValue.permId
            }, this.formType).then(res => {
              this.confirmLoading = false
              this.$emit('success', {...conditions, permId: this.initialValue.permId})
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
