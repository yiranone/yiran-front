<template>
  <a-modal :visible="parent.formVisible"
           :title="title"
           :width="550"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="parent.formVisible = false"
           @ok="handleOk">
    <a-form :form="form" :hideRequiredMark="true" :colon="false">
      <a-form-item label="角色名称" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}" >
        <a-input allowClear placeholder="请输入角色名称"
                 v-decorator="['roleName', {rules:[{required: true, message: '请输入角色名称'}]}]"/>
      </a-form-item>
      <a-form-item label="权限字符" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}" >
        <a-input allowClear placeholder="请输入权限字符"
                 v-decorator="['roleKey', {rules: [{required: true, message: '请输入权限字符'}]}]"/>
      </a-form-item>
      <a-form-item label="显示顺序" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}" >
        <a-input-number allowClear placeholder="请设置显示顺序"
                        v-decorator="['roleSort', {rules: [{required: true, message: '请设置显示顺序'}]}]"/>
      </a-form-item>
      <a-form-item label="状态" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 16}}">
        <a-radio-group :options="statusOptions"
                       v-decorator="['status', {rules: [{required: true, message: '请设置状态'}]}]"/>
      </a-form-item>
      <a-form-item label="权限" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}">
        <a-tree-select
            :tree-data="parent.permsList"
            placeholder="Please select"
            :replaceFields="replaceFields"
            :treeCheckable="true"
            allowClear
            v-decorator="['permIds', {rules: [{required: true, message: '请选择权限'}]}]"
        />
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
        replaceFields: {
          key: 'permId',
          value: 'permId',
          title: 'permName',
        },
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
          keys = ['roleName', 'roleKey', 'roleSort', 'status', 'permIds']
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
        return `${this.formType}角色`
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
            us.roleAddOrEditor({
              ...conditions,
              roleId: this.initialValue.roleId
            }, this.formType).then(res => {
              this.confirmLoading = false
              this.$emit('success', {...conditions, roleId: this.initialValue.roleId})
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
