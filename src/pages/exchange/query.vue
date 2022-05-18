<template>
  <a-row>
    <a-form layout="horizontal" @submit="onSubmit" :form="form" :hideRequiredMark="true">
      <a-col :md="8" :sm="24">
        <a-form-item
            label="兑换码"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入兑换码"
                   v-decorator="['code']"/>
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
            label="状态"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-select v-decorator="['status']" placeholder="请选择状态">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="SUCCESS">已核销</a-select-option>
            <a-select-option value="SENT">核销中</a-select-option>
            <a-select-option value="NEW">待核销</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="账户名"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入账户名"
                   v-decorator="['srcName']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="冻结地址"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入冻结地址"
                   v-decorator="['fromAddress']"/>
        </a-form-item>
      </a-col>


      <a-col :md="8" :sm="24">
        <a-form-item
            label="核销地址"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入核销地址"
                   v-decorator="['targetAddress']"/>
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