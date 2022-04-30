<template>
  <a-form @submit="onSubmit" :form="form" :hideRequiredMark="true">
    <a-form-item
        label="链名称"
        :labelCol="{span: 3}"
        :wrapperCol="{span: 18, offset: 0}"
    >
      <a-select v-decorator="['chain']" placeholder="请选择链名称">
        <a-select-option value="TRX">TRX</a-select-option>
        <a-select-option value="ETH">ETH</a-select-option>
        <a-select-option value="FIL">FIL</a-select-option>
        <a-select-option value="CRU">CRU</a-select-option>
        <a-select-option value="PHA">PHA</a-select-option>
        <a-select-option value="BSC">BSC</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
        label="币名称"
        :labelCol="{span: 3}"
        :wrapperCol="{span: 18, offset: 0}"
    >
      <a-select v-decorator="['currency']" placeholder="请选择币名称">
        <a-select-option value="TRX">TRX</a-select-option>
        <a-select-option value="USDT">USDT</a-select-option>
        <a-select-option value="FIL">FIL</a-select-option>
        <a-select-option value="CRU">CRU</a-select-option>
        <a-select-option value="PHA">PHA</a-select-option>
        <a-select-option value="BNB">BNB</a-select-option>
        <a-select-option value="SWF">SWF</a-select-option>
        <a-select-option value="BOLT">BOLT</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
        label="交易HASH号"
        :labelCol="{span: 3}"
        :wrapperCol="{span: 18, offset: 0}"
    >
      <a-input allowClear
               placeholder="请输入交易HASH号"
               v-decorator="['txnHash']"/>
    </a-form-item>
    <div class="flex horizontal-center">
      <a-button type="primary" :loading="loading" htmlType="submit">发送</a-button>
    </div>
  </a-form>
</template>

<script>
  export default {
    name: "query",
    data() {
      return {
        form: this.$form.createForm(this)
      }
    },
    props: {
      conditions: Object,
      loading: Boolean
    },

    mounted() {
      this.$nextTick(() => {
        this.form.setFieldsValue({chain: 'TRX', currency: 'TRX'})
      })
    },

    methods: {
      onSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err) => {
          if (!err) {
            const conditions = this.form.getFieldsValue()
            this.$emit('onQuery', conditions)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
