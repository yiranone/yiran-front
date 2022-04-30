<template>
  <a-row>
    <a-form layout="horizontal" @submit="onSubmit" :form="form" :hideRequiredMark="true">
      <a-col :md="8" :sm="24">
        <a-form-item
            label="地址"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入地址"
                   v-decorator="['address']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="币名称"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-select v-decorator="['currency']" placeholder="请选择币名称">
            <a-select-option value="">全部</a-select-option>
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
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="外部账户ID"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入外部账户ID"
                   v-decorator="['externalId']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="账户标识"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入账户标识"
                   v-decorator="['srcSys']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="内部账户名称"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入内部账户名称"
                   v-decorator="['innerAccountName']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="起始金额"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input-number allowClear
                          placeholder="请输入起始金额"
                          v-decorator="['minAmount']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="最大金额"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input-number allowClear
                          placeholder="请输入最大金额"
                          v-decorator="['maxAmount']"/>
        </a-form-item>
      </a-col>
      <a-col style="margin-top: 3px" :md="{span: 5, offset: 1}">
        <a-button type="primary" htmlType="submit">查询</a-button>
        <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
      </a-col>
    </a-form>
  </a-row>
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
      conditions: Object
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
      },

      onReset() {
        this.form.resetFields();
        const conditions = this.form.getFieldsValue()
        this.$emit('onQuery', conditions)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>