<template>
  <a-form @submit="onSubmit" :form="form" :hideRequiredMark="true">
    <a-form-item>
      <a-input-search placeholder="请输入验证码"
                      @search="onSearch"
                      v-decorator="['code', {rules: [{required: true, message: '请输入验证码'}]}]" >
        <a-button type="primary"
                  slot="enterButton"
                  :loading="codeLoading"
                  :disabled="codeDisabled">{{codeText}}</a-button>
      </a-input-search>
    </a-form-item>
    <a-form-item>
      <a-input-password allowClear placeholder="请输入资金密码"
                        v-decorator="['password', {rules: [{required: true, message: '请输入密码'}]}]"/>
    </a-form-item>
    <div class="flex horizontal-center">
      <a-button type="primary"  htmlType="submit">确认</a-button>
    </div>
  </a-form>
</template>

<script>
  import {userService as us} from '../../services'
  import {mapState} from 'vuex'
  export default {
    name: "assetPassword",
    data() {
      return {
        form: this.$form.createForm(this),
        confirmLoading: false,
        codeLoading: false,
        codeText: '获取验证码',
        token: '',
        timer: null
      }
    },

    computed: {
      ...mapState('account', ['user']),
      codeDisabled() {
        return this.codeText.includes('s')
      }
    },

    methods: {
      onSearch() {
        if(this.codeLoading) return;
        this.codeLoading = true
        us.sendSms()
            .then(res => {
              this.token = res.token
              this.codeLoading = false
              this.$message.success(`短信已发送`)
              let count = 60
              this.codeText = `还剩${count}s`
              this.timer = setInterval(() => {
                count--
                this.codeText = `还剩${count}s`
                if (count == 0) {
                  clearInterval(this.timer)
                  this.codeText = `重新获取`
                }
              }, 1000)
            }).catch(res => {
          this.codeLoading = false
        })
      },

      onSubmit(e) {
        e.preventDefault()
        this.form.validateFields(async  (err) => {
          if (!err) {
            const conditions = this.form.getFieldsValue()
            if(this.confirmLoading) return;
            this.confirmLoading = true
            await us.resetPassword({
              ...conditions,
              token: this.token,
              srcSys: this.user.srcSys
            }).then(res => {
              this.$emit('success')
              this.$message.success('设置成功')
            }).catch(res => {})
            this.form.resetFields()
            this.confirmLoading = false
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
