<template>
  <a-modal :visible="visible"
           title="创建兑换码"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="handleCancel"
           @ok="handleOk">
    <a-form-model ref="form" :model="formData" :rules="rules" :labelCol="{span: 5}" :wrapperCol="{span: 18}">
      <a-form-model-item label="冻结账户">
        <span>{{ assetInfo.address }}</span>
      </a-form-model-item>
      <a-form-model-item label="兑换码金额" prop="amount">
        <a-input v-model="formData.amount"></a-input>
      </a-form-model-item>
      <a-form-model-item label="兑换码数量" prop="size">
        <a-input v-model="formData.size"></a-input>
      </a-form-model-item>
      <a-form-model-item label="账户可用余额">
        <span>{{ assetInfo.availableAmount }} {{ assetInfo.currency }}</span>
      </a-form-model-item>
      <a-form-model-item label="支付密码" prop="password">
        <a-input-password v-model="formData.password"
                          placeholder="请输入支付密码"
                          autocomplete="new-password"
                          visibilityToggle
        ></a-input-password>
      </a-form-model-item>
      <a-form-model-item label="短信验证码" prop="code">
        <a-input-search
            v-model="formData.code"
            placeholder="请输入短信验证码"
            @search="handleCode"
        >
          <a-button :loading="codeLoading" :disabled="codeDisable" type="primary" slot="enterButton">
            {{ codeText }}
          </a-button>
        </a-input-search>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {userService as us} from "@/services";

export default {
  data() {
    const amountValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入兑换码金额'));
      } else if (Number(value || 0) > Number(this.assetInfo.availableAmount)) {
        callback(new Error('兑换码金额不能大于账户可用余额'));
      } else if (Number(value || 0) * Number(this.formData.size || 0) > Number(this.assetInfo.availableAmount)) {
        callback(new Error('兑换码金额*兑换码数量不能大于账户可用余额'));
      } else {
        callback()
      }
    }

    const sizeValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入兑换码数量'));
      } else if (Number(value || 0) * Number(this.formData.amount || 0) > Number(this.assetInfo.availableAmount)) {
        callback(new Error('兑换码金额*兑换码数量不能大于账户可用余额'));
      } else {
        callback()
      }
    }
    return {
      confirmLoading: false,
      formData: {
        amount: '',
        size: '',
        password: '',
        code: ''
      },
      rules: {
        amount: {required: true, validator: amountValidator, trigger: 'change'},
        size: {required: true, validator: sizeValidator, trigger: 'change'},
        password: {required: true, message: '请输入支付密码', trigger: 'blur'},
        code: {required: true, message: '请输入短信验证码', trigger: 'blur'}
      },
      timer: null,
      token: '',
      codeLoading: false,
      codeText: '获取验证码'
    }
  },
  props: {
    visible: Boolean,
    assetInfo: Object
  },

  watch: {
    visible() {
      this.$nextTick(() => {
        this.codeText = '获取验证码'
        if (this.timer) clearTimeout(this.timer);
        this.$refs.form.resetFields()
      })
    }
  },

  computed: {
    codeDisable() {
      return this.codeText.includes('s')
    }
  },
  methods: {
    async handleCode() {
      this.codeLoading = true
      await us.sendSms()
          .then(res => {
            this.token = res.token
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
          }).catch(() => {
          })
      this.codeLoading = false
    },

    handleCancel() {
      this.$emit('update:visible', false)
    },

    handleOk() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await us.generateExchange({
            srcSys: this.assetInfo.srcSys,
            accountId: this.assetInfo.accountId,
            chain: this.assetInfo.chain,
            currency: this.assetInfo.currency,
            size: this.formData.size,
            amount: this.formData.amount,
            token: this.token,
            password: this.formData.password,
            code: this.formData.code
          }).then(res => {
            this.$message.success(`创建兑换码成功`)
            this.$confirm({
              title: '兑换码创建成功，是否下载兑换码?',
              content: '',
              onOk() {
                // us.downloadExchange({fileName: res.fileName, delete: true})
                us.downloadExchange({fileName: res})
              },
              onCancel() {},
            });
          }).catch(() => {})
          this.confirmLoading = false
          this.handleCancel()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>