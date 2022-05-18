<template>
  <a-row>
    <a-form @submit="onSubmit" :form="form" :hideRequiredMark="true" :colon="false">
      <!--<a-col :md="12" :sm="24">
        <a-form-item
            label="菜单名称"
            :labelCol="{span: 5}"
            :wrapperCol="{span: 19, offset: 0}"
        >
          <a-input allowClear
                   placeholder="请输入菜单名称"
                   v-decorator="['fromAccount']"/>
        </a-form-item>
      </a-col>
      <a-col style="margin-top: 3px" :md="{span: 5, offset: 1}">
        <a-button type="primary" htmlType="submit">查询</a-button>
        <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
      </a-col>-->
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
