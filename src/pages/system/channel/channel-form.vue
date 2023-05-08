<template>
  <a-modal :visible="open"
           :title="formTitle"
           :width="1000"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="open = false"
           @ok="submitForm">
    <a-form-model ref="form" :model="form" :rules="rules"  :label-col="{span:6}" :wrapper-col="{span:16}">
      <a-form-model-item label="渠道名称" prop="channelName">
        <a-input v-model="form.channelName" placeholder="请输入" :disabled="formTitle == '修改渠道'"/>
      </a-form-model-item>
      <a-form-model-item label="渠道编码" prop="channelCode">
        <a-input v-model="form.channelCode" placeholder="请输入" :disabled="formTitle == '修改渠道'"/>
      </a-form-model-item>
      <a-form-model-item label="排序" prop="channelSort">
        <a-input v-model="form.channelSort" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="有效期" prop="expireDate">
        <a-date-picker v-model="form.expireDate" format="YYYY-MM-DD"/>
      </a-form-model-item>
<!--      <a-form-model-item label="状态" prop="status">
        <a-radio-group v-model="form.status" :options="statusOptions"/>
      </a-form-model-item>-->
      <a-form-model-item label="状态" prop="status">
        <a-radio-group v-model="form.status" button-style="solid">
          <a-radio-button v-for="(d, index) in this.$store.getters.system_normal_disable" :key="index" :value="d.value" >{{ d.label }}</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {dataSource} from '@/services/index'

  export default {
    name: "ChannelEdit",
    data() {
      return {
        form: {},
        formTitle: '',
        confirmLoading: false,
        open: false,
        rules: {
          channelName: [{ required: true, message: '渠道名称不能为空', trigger: 'blur' }],
          channelCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
          channelSort: [{ required: true, message: '不能为空', trigger: 'blur' }],
          expireDate: [{ required: true, message: '不能为空', trigger: 'blur' }],
          status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
        }
      }
    },
    created() {
    },
    methods: {
      onClose () {
        this.open = false
      },
      // 取消按钮
      cancel () {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset () {
        this.form = {
          status:"1"
        }
      },
      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.open = true
        this.formTitle = '新增渠道'
      },
      /** 修改按钮操作 */
      handleUpdate (row, ids) {
        this.reset()
        const channelId = row ? row.channelId : ids[0]
        dataSource.channelDetail({"channelId":channelId}).then(data => {
          this.form = data
          this.form.expireDate = this.$moment(row.expireDate)
          this.open = true
          this.formTitle = '修改渠道'
        })
      },
      submitForm: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.confirmLoading = true
            if (this.form.channelId !== undefined) {
              dataSource.channelEdit({
                ...this.form,
                expireDate: this.$moment(this.form["expireDate"]).format("YYYY-MM-DD"),
              }).then(data => {
                this.$message.success('修改成功')
                this.open = false
                this.$emit('ok')
              }).finally(() => {
                this.confirmLoading = false
              })
            } else {
              dataSource.channelAdd({
                ...this.form,
                expireDate: this.$moment(this.form["expireDate"]).format("YYYY-MM-DD"),
              }).then(data => {
                this.$message.success('新增成功')
                this.open = false
                this.$emit('ok')
              }).finally(() => {
                this.confirmLoading = false
              })
            }
          } else {
            return false
          }
        })
      },

    }
  }
</script>

<style lang="less" scoped>

</style>
