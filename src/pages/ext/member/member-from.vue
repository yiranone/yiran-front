<template>
  <a-modal :visible="open"
           :title="formTitle"
           :width="1000"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="open = false"
           @ok="submitForm">
    <a-form-model ref="form" :model="form" :rules="rules"  :label-col="{span:6}" :wrapper-col="{span:16}">
      <a-form-model-item :label="$t('phone')" prop="phone">
        <a-input v-model="form.phone" placeholder="" />
      </a-form-model-item>
      <a-form-model-item :label="$t('name')" prop="name">
        <a-input v-model="form.name" allowClear placeholder=""/>
      </a-form-model-item>
      <a-form-model-item v-if="isNew" :label="$t('password')"  prop="password">
        <a-input-password v-model="form.password" allowClear placeholder=""/>
      </a-form-model-item>
      <a-form-model-item :label="$t('status')" :colon="false" prop="status">
        <a-radio-group v-model="form.status" :options="statusOptions"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {dataSource} from '@/services'

  export default {
    name: "member-from",
    i18n: require('./i18n'),
    data() {
      return {
        isNew :false,
        isEdit :false,
        form: {},
        formTitle: '',
        statusOptions: [],
        confirmLoading: false,
        open: false,
        rules: {
          phone: [{ required: true, message: this.$ta('phone|can_not_blank'), trigger: 'blur' }],
          name: [{ required: true, message: this.$ta('name|can_not_blank'), trigger: 'blur' }],
          password: [{ required: true, message: this.$ta('password|can_not_blank') , trigger: 'blur' }],
          status: [{ required: true, message:  this.$ta('status|can_not_blank'), trigger: 'blur' }]
        }
      }
    },
    computed: {
    },
    created() {
      this.statusOptions= this.$store.getters.system_user_status
    },
    watch: {
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
        }
      },
      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.open = true
        this.isNew = true
        this.formTitle = this.$ta('add|moduleName','p')
      },
      /** 修改按钮操作 */
      handleUpdate (row, ids) {
        this.reset()
        const memberId = row ? row.memberId : ids[0]
        dataSource.memberDetail({"memberId":memberId}).then(data => {
          this.form = data
          this.open = true
          this.isEdit = true
          this.formTitle = this.$ta('edit|moduleName','p')
        })
      },
      submitForm: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.confirmLoading = true
            if (this.form.memberId !== undefined) {
              dataSource.memberEdit(this.form).then(data => {
                this.$message.success(this.$t('notice_edit_success'))
                this.open = false
                this.$emit('ok')
              }).finally(() => {
                this.confirmLoading = false
              })
            } else {
              dataSource.memberAdd(this.form).then(data => {
                this.$message.success(this.$t('notice_add_success'))
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
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
