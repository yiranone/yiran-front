<template>
  <a-modal :visible="parent.formVisible"
           :title="title"
           :width="550"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="parent.formVisible = false"
           @ok="handleOk">
    <a-form :form="form" :hideRequiredMark="true">
      <a-form-item label="登录账号" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}" :colon="false">
        <a-input allowClear placeholder="请输入登录名称"
                 :disabled="formType != '新增'"
                 v-decorator="['loginName', {rules:[{required: true, message: '请输入用户名称'}]}]"/>
      </a-form-item>
      <a-form-item v-if="formType != '重置'" label="用户名称" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}"
                   :colon="false">
        <a-input allowClear placeholder="请输入用户名称"
                 v-decorator="['userName', {rules: [{required: true, message: '请输入用户名称'}]}]"/>
      </a-form-item>
      <a-form-item v-if="formType != '重置'" label="手机号" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}"
                   :colon="false">
        <a-input :maxLength="11" allowClear placeholder="请输入手机号"
                 v-decorator="['phoneNumber', {rules: [{required: true, message: '请输入手机号'}]}]"/>
      </a-form-item>
      <a-form-item v-if="formType != '重置'" label="角色" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 20}}"
                   :colon="false">
        <a-checkbox-group v-decorator="['roleIds', {rules: [{required: true, message: '请选择角色'}]}]">
          <a-checkbox v-for="(role,index) in parent.roleList"
                      :key="`role_${index}`" :value="role.roleId">{{role.roleName}}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item v-if="formType != '编辑'" :label="`${formType == '新增'? '登录' : '重置'}密码`" :labelCol="{sm: {span: 4}}"
                   :wrapperCol="{sm: {span: 20}}" :colon="false">
        <a-input-password allowClear placeholder="请输入登录密码"
                          v-decorator="['password', {rules: [{required: true, message: '请输入登录密码'}]}]"/>
      </a-form-item>
      <a-form-item v-if="formType != '重置'" label="用户状态" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 16}}"
                   :colon="false">
        <a-radio-group :options="statusOptions"
                       v-decorator="['status', {rules: [{required: true, message: '请设置用户状态'}]}]"/>
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
        confirmLoading: false,
        roleIds: []
      }
    },

    watch: {
      initialValue(val) {
        if (JSON.stringify(val) != "{}") {
          let obj = {}, keys = [];
          keys = ['loginName', 'userName', 'phoneNumber', 'roleIds', 'status']
          if (this.formType == '重置') {
            keys = ['loginName', 'password']
          }
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
        return this.formType == '重置' ? '重置密码' : `${this.formType}用户`
      }
    },

    methods: {
      handleOk(e) {
        e.preventDefault()
        this.form.validateFields(async (err) => {
          if (!err) {
            const conditions = this.form.getFieldsValue()
            this.confirmLoading = true
            if(this.formType != '重置') {
              us.userAddOrEditor({
                ...conditions,
                userId: this.initialValue.userId
              }, this.formType).then(res => {
                this.confirmLoading = false
                this.$emit('success', {...res, roleIds: conditions.roleIds})
              }).catch(res => {
                this.confirmLoading = false
              })
            } else {
              await us.userResetPwd({
                ...conditions,
                userId: this.initialValue.userId
              }).then(() => {
                this.$message.success('密码重置成功')
              }).catch(res => {})
              this.confirmLoading = false
              this.parent.formVisible = false
            }
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
