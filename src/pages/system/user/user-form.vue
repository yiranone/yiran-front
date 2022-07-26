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
          <a-form-item label="登录名称" :label-col="{span:8}" :wrapper-col="{span:16}">
            <a-input allowClear placeholder="请输入登录名称"
                     :disabled="formType != '新增'"
                     v-decorator="['loginName', {rules:[{required: true, message: '请输入用户名称'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12">
          <a-form-item v-if="formType != '重置'" label="用户名" :label-col="{span:8}" :wrapper-col="{span:16}">
            <a-input :maxLength="32" allowClear placeholder="请输入用户名"
                     v-decorator="['userName', {rules: [{required: true, message: '请输入用户名'}]}]"/>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row class="form-row">
        <a-col :md="12">
          <a-form-item v-if="formType != '重置'" label="手机号" :label-col="{span:8}" :wrapper-col="{span:16}">
            <a-input :maxLength="11" allowClear placeholder="请输入手机号"
                     v-decorator="['phoneNumber', {rules: [{required: true, message: '请输入手机号'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12">

        </a-col>
      </a-row>

      <a-form-item label="部门" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 8}}">
        <a-tree-select
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="deptOptions"
            placeholder="请选择"
            :replaceFields="replaceFields"
            tree-default-expand-all
            v-decorator="['deptId', {rules: [{required: true, message: '请选择部门'}]}]"
        >
        </a-tree-select>
      </a-form-item>

<!--      <a-form-item v-if="formType != '重置'" label="部门" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 8}}"
                   :colon="false">
        <a-input :maxLength="11" allowClear
                 v-decorator="['deptId', {rules: [{required: true, message: '请选择部门'}]}]"/>
      </a-form-item>-->
      <a-form-item label="渠道号" :labelCol="{sm: {span: 4}}" :wrapperCol="{sm: {span: 8}}"
                   :colon="false">
        <a-select placeholder="请选择"
                  :disabled="formType != '新增'"
                  v-decorator="['channelId', {rules: [{required: true, message: '请选择渠道'}]}]">
          <a-select-option v-for="(d, index) in channelOptions" :key="index" :value="d.channelId" >{{ d.channelName }}</a-select-option>
        </a-select>
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
  import {userService as us } from '@/services/index'

  export default {
    name: "user-form",
    components: {},
    props: {
      channelOptions:{},
      deptOptions: {
        type: Array,
        required: true
      },
      statusOptions: {
        type: Array,
        required: true
      },
      sexOptions: {
        type: Array,
        required: true
      }
    },
    inject: ['parent'],
    data() {
      return {
        form: this.$form.createForm(this),
        replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
        confirmLoading: false,
        roleIds: []
      }
    },
    created() {
    },

    watch: {
      initialValue(val) {
        if (JSON.stringify(val) != "{}") {
          let obj = {}, keys = [];
          keys = ['loginName', 'userName', 'phoneNumber', 'deptId','channelId', 'roleIds', 'status']
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
      },

    }
  }
</script>

<style lang="less" scoped>

</style>
