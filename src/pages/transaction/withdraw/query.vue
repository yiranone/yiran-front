<template>
  <a-row>
    <a-form @submit="onSubmit" :form="form" :hideRequiredMark="true">
      <a-col :md="8" :sm="24">
        <a-form-item
            label="转出地址"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入转出地址"
                   v-decorator="['fromAddress']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="转入地址"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入转入地址"
                   v-decorator="['toAddress']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="转出账户"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入转出账户"
                   v-decorator="['fromAccount']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="转入账户"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入转入账户"
                   v-decorator="['toAccount']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="交易ID"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入交易ID"
                   v-decorator="['txnId']"/>
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
            label="交易类型"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-select v-decorator="['type']" placeholder="请选择币名称">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="EXTERNAL_WITHDRAW">客户提现</a-select-option>
            <a-select-option value="INTERNAL_WITHDRAW">内部提现</a-select-option>
            <a-select-option value="GATHER_WITHDRAW">归集提现</a-select-option>
            <a-select-option value="GIVE_OUT_WITHDRAW">发放提现</a-select-option>
          </a-select>
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
            label="账户名称"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入账户名称"
                   v-decorator="['innerAccountName']"/>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item
            label="状态"
            :labelCol="{span: 6}"
            :wrapperCol="{span: 18, offset: 0}"
        >
          <a-select allowClear
                    placeholder="请选择状态"
                    :options="stautsOptions"
                    v-decorator="['status']" />
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
        form: this.$form.createForm(this),
        stautsOptions: [
          {
            value: 'NEW',
            label: '新建'
          }, {
            value: 'CONFIRMED',
            label: '交易成功'
          }, {
            value: 'REVERTED',
            label: '交易失败'
          }, {
            value: 'UNCONFIRMED',
            label: '处理中'
          }, {
            value: 'SENT',
            label: '已发出'
          }
        ]
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
