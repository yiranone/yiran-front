<template>
  <a-modal :visible="visible"
           title="设置支付密码"
           @cancel="hanldeCancle"
           @ok="handleOk"
           :confirmLoading="confirmLoading">
    <a-form :form="form" :hideRequiredMark="true">
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
        <a-input-password placeholder="请输入密码"
                          autocomplete="new-password"
                          visibilityToggle
                          v-decorator="['password', {rules: [{required: true, message: '请输入密码'}]}]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import {userService as us} from '../../services'
  export default {
    name: "setPayPwd",
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
    props: {
      visible: Boolean,
      assetInfo: Object
    },

    watch: {
      visible() {
        this.$nextTick(() => {
          this.form.resetFields()
        })
      }
    },

    computed: {
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

      hanldeCancle() {
        if (this.timer) clearInterval(this.timer);
        this.form.resetFields();
        this.confirmLoading = false;
        this.codeLoading = false;
        this.codeText = '获取验证码';
        this.token = '';
        this.timer = null;
        this.$emit('cancle')
      },

      handleOk(e) {
        e.preventDefault()
        this.form.validateFields((err) => {
          if (!err) {
            const conditions = this.form.getFieldsValue()
            if(this.confirmLoading) return;
            this.confirmLoading = true
            us.resetPassword({
              ...conditions,
              token: this.token,
              srcSys: this.assetInfo.srcSys
            }).then(res => {
              this.confirmLoading = false
              this.$emit('success')
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
