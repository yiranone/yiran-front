<template>
  <a-modal :visible="parent.formVisible"
           :title="title"
           :width="650"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="parent.formVisible = false"
           @ok="handleOk"
           :afterClose="afterClose">
    <a-form :form="form2" :hideRequiredMark="true">
      <a-form-item label="上级目录"
                   :labelCol="{sm: {span: 3}}"
                   :wrapperCol="{sm: {span: 20}}">
        <a-tree-select
            :tree-data="treeData"
            placeholder="请选择上级目录"
            :replaceFields="replaceFields"
            :treeExpandedKeys.sync="treeExpandedKeys"
            allowClear
            v-decorator="['parentId', {rules: [{required: true, message: '请设置上级目录'}]}]"/>
      </a-form-item>
      <a-row type="flex" justify="space-between">
        <a-col :sm="{span: 24}" :xs="24">
          <a-form-model-item label="名称"
                             :labelCol="{sm: {span: 3}}"
                             :wrapperCol="{sm: {span: 18}}">
            <a-input placeholder="部门名称"
                     allowClear
                     v-decorator="['deptName', {rules: [{required: true, message: '请设置部门名称'}]}]"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-between">
        <a-col :sm="{span: 24}" :xs="24">
          <a-form-model-item label="部门编码"
                             :labelCol="{sm: {span: 3}}"
                             :wrapperCol="{sm: {span: 18}}">
            <a-input placeholder="请输入部门编码"
                     allowClear
                     v-decorator="['deptCode', {rules: [{required: true, message: '请设置部门编码'}]}]"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-between">
        <a-col :sm="{span: 12}" :xs="24">
          <a-form-model-item class="radio"
                             label="显示排序"
                             :labelCol="{sm: {span: 6}}"
                             :wrapperCol="{sm: {span: 16}}">
            <a-input-number placeholder="请设置显示排序"
                            :min="1" :max="999"
                            v-decorator="['orderNum', {rules: [{required: true, message: '请设置排序'}]}]"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-between">
        <a-col :sm="{span: 12}" :xs="24">
          <a-form-model-item label="显示状态"
                             :labelCol="{sm: {span: 6}}"
                             :wrapperCol="{sm: {span: 16}}">
            <a-radio-group :options="statusOptions"
                           v-decorator="['status', {rules: [{required: true, message: '请设置排序'}]}]"/>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import {dataSource as ds} from '@/services'

export default {
  name: "m-form",
  inject: ['parent'],
  data() {
    return {
      replaceFields: {
        key: 'deptId',
        value: 'deptId',
        title: 'deptName'
      },
      statusOptions: [
        {label: '正常', value: '0'},
        {label: '停用', value: '1'},
      ],
      confirmLoading: false,
      treeExpandedKeys: [1],
      form2: this.$form.createForm(this, {name: 'form2'}),
    }
  },

  watch: {
    formInfo(val) {
      if (JSON.stringify(val) != "{}") {
        let obj = {}, keys = [];
        keys = ['deptName', 'deptCode', 'orderNum', 'parentId', 'status']
        keys.forEach(item => {
          obj[item] = val[item] || ''
        })
        this.$nextTick(() => {
          this.form2.setFieldsValue({...val})
          this.treeExpandedKeys = [val.parentId]
        })
      }
    }
  },

  computed: {
    formInfo() {
      return this.parent.deptInfo
    },
    formType() {
      return this.parent.formType
    },
    title() {
      return `${this.parent.formType}部门`
    },
    treeData() {
      return [
        {
          deptId: 0,
          parentId: 0,
          deptName: '根目录',
          children: this.parent.dataSource
        },
      ]
    }
  },

  methods: {
    afterClose() {
      this.parent.formType = ''
      this.parent.deptInfo = {}
    },

    async handleOk() {
      this.form2.validateFields(async (err) => {
        if (!err) {
          const conditions = this.form2.getFieldsValue()
          this.confirmLoading = true
          ds.deptEdit({
            ...conditions,
            deptId: this.formInfo.deptId
          }, this.formType).then(res => {
            this.confirmLoading = false
            this.parent.formVisible =false
            this.$emit('success', {...res})
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
/deep/ .ant-input-number {
  width: 100%;
}
</style>
