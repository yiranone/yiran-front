<template>
  <a-modal :visible="visible"
           :destroyOnClose="true"
           title="提币"
           @cancel="hanldeCancle"
           @ok="handleOk"
           :confirmLoading="confirmLoading">
    <a-form layout="horizontal"
            :form="form"
            :hideRequiredMark="true">
      <a-form-item label="提现账户"
                   :labelCol="{sm: {span: 3}}"
                   :wrapperCol="{sm: {span: 20, offset: 1}}"
                   :colon="false">
        <a-input  disabled v-decorator="['toAddress',{initialValue: address}]"/>
      </a-form-item>
      <a-form-item label="提现数量"
                   :labelCol="{sm: {span: 3}}"
                   :wrapperCol="{sm: {span: 20, offset: 1}}"
                   :colon="false">
        <a-input-number :suffix="assetInfo.currency"
                        placeholder="请输入提现数量"
                        @change="handleAmountChange"
                        v-decorator="['amount', {rules: [{required: true, message: '请输入提现数量'}]}]"/>
      </a-form-item>
      <P class="cell flex space-between">
        <span>可提数量</span>
        <span class="flex-1">{{Number(assetInfo.availableAmount)}}{{assetInfo.currency}}</span>
        <span class="all" @click.stop="doAll">全部</span>
      </P>
      <P class="cell flex space-between"><span>到账数量</span><span>{{actualNum}}{{assetInfo.currency}}</span></P>
      <a-form-item label="支付密码"
                   :labelCol="{sm: {span: 3}}"
                   :wrapperCol="{sm: {span: 20, offset: 1}}"
                   :colon="false">
        <a-input-password placeholder="请输入支付密码"
                          autocomplete="new-password"
                          v-decorator="['password', {rules: [{required: true, message: '请输入密码'}]}]"/>
      </a-form-item>
      <a-form-item>
        <a-input-search placeholder="请输入验证码"
                        @search="onSearch"
                        v-decorator="['code', {rules: [{required: true, message: '请输入验证码'}]}]">
          <a-button type="primary"
                    slot="enterButton"
                    :loading="codeLoading"
                    :disabled="codeDisabled">{{codeText}}</a-button>
        </a-input-search>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import {userService as us} from '../../services'
  export default {
    name: "withdrawModal",
    data() {
      return {
        form: this.$form.createForm(this),
        codeLoading: false,
        confirmLoading: false,
        amount: '',
        codeText: '获取验证码',
        token: '',
        timer: null
      }
    },
    props: {
      visible: Boolean,
      assetInfo: Object
    },

    computed: {
      address() {
        return this.assetInfo.withdrawAddress
      },

      withdrawRate() {
        return this.assetInfo.withdrawRate
      },

      actualNum() {
        return this.amount || 0
      },

      codeDisabled() {
        return this.codeText.includes('s')
      }
    },

    methods: {
      handleAmountChange(value) {
        this.amount = value
      },

      onSearch() {
        if (this.codeLoading) return;
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
        this.amount = '';
        this.codeText = '获取验证码';
        this.token = '';
        this.timer = null;
        this.$emit('cancle')
      },

      doAll() {
        this.form.setFieldsValue({amount: Number(this.assetInfo.availableAmount)})
        this.amount = Number(this.assetInfo.availableAmount)
      },

      handleOk(e) {
        e.preventDefault()
        this.form.validateFields((err) => {
          if (!err) {
            const conditions = this.form.getFieldsValue()
            if (this.confirmLoading) return;
            this.confirmLoading = true
            us.withdrawApply({
              ...conditions,
              srcSys: this.assetInfo.srcSys,
              innerAccountId: this.assetInfo.accountId,
              chain: this.assetInfo.chain,
              currency: this.assetInfo.currency,
              token: this.token
            }).then(res => {
              this.confirmLoading = false
              this.$message.success(`提现成功`)
              this.$emit('cancle')
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
  .cell {
    padding: 5px 0;

    span {
      color: rgba(0, 0, 0, 0.85);;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }
    .all {
      &:hover {
        cursor: pointer;
        color: @primary-color;
      }
    }
  }
</style>
