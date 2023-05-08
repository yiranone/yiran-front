<template>
  <a-modal
    :title="title"
    :visible="open"
    :confirm-loading="submitLoading"
    @ok="submitForm"
    @cancel="cancel"
  >
    <a-form-model ref="resetForm" :model="userVO" :rules="rules" :label-col="{span:6}" :wrapper-col="{span:16}">
      <a-form-model-item label="登录账号" prop="loginName">
        <a-input v-model="userVO.loginName" :disabled="true"/>
      </a-form-model-item>
      <a-form-model-item label="用户名" prop="userName">
        <a-input v-model="userVO.userName" :disabled="true"/>
      </a-form-model-item>
      <a-form-model-item has-feedback label="新密码" prop="newPassword">
        <a-input-password v-model="userVO.newPassword" placeholder="请输入新密码" :maxLength="20" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="确认密码" prop="confirmPassword">
        <a-input-password v-model="userVO.confirmPassword" placeholder="请确认密码" :maxLength="20" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import {dataSource} from '@/services/index'

export default {
  name: 'ResetPassword',
  props: {
  },
  data () {
    const validateNewPass = (rule, value, callback) => {
      if (value == null || value === '') {
        callback(new Error('请输入新密码'))
      }
      // else if (!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){5,20}$/.test(value)) {
      //   callback(new Error('请输入5-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'))
      // }
      else {
        if (this.userVO.confirmPassword !== '') {
          this.$refs.resetForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validateConfirmPass = (rule, value, callback) => {
      if (value == null || value === '') {
        callback(new Error('请再次输入新密码确认'))
      } else if (value !== this.userVO.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      submitLoading: false,
      title: '重置密码',
      open: false,
      userVO: {
        loginName: undefined,
        userName: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      rules: {
        newPassword: [
          { required: true, validator: validateNewPass, trigger: 'change' }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPass, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.userVO = {
        userId: undefined,
        loginName: undefined,
        userName: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      }
    },
    handleResetPwd (row) {
      this.userVO = {
        userId: row.userId,
        loginName: row.loginName,
        userName: row.userName
      }
      this.open = true
    },
    /** 重置密码按钮操作 */
    submitForm: function () {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          dataSource.userResetPwd({
            ...this.userVO
          }).then(response => {
            this.$message.success(
              '重置成功',
              3
            )
            this.open = false
          }).finally(() => {
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
