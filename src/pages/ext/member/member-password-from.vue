<template>
  <a-modal :visible="open"
           :title="formTitle"
           :width="1000"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="open = false"
           @ok="submitForm">
    <a-form-model ref="form" :model="form" :rules="rules" :label-col="{span:6}" :wrapper-col="{span:16}">
      <a-form-model-item :label="$t('phone')" prop="phone">
        <a-input v-model="form.phone"  :disabled=true />
      </a-form-model-item>
      <a-form-model-item :label="$t('password')"  prop="password">
        <a-input-password v-model="form.password" allowClear placeholder=""/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {dataSource} from '@/services'

  export default {
    name: "member-password-from",
    i18n: require('./i18n'),
    data() {
      return {
        form: {},
        formTitle: '',
        confirmLoading: false,
        open: false,
        rules: {
          password: [{ required: true, message: this.$ta('password|can_not_blank') , trigger: 'blur' }],
        }
      }
    },
    watch: {
    },
    computed: {
    },
    methods: {
      handleUpdate (row, ids) {
        this.form = {}
        const memberId = row ? row.memberId : ids[0]
        dataSource.memberDetail({"memberId":memberId}).then(data => {
          this.form = data
          this.open = true
          this.formTitle = this.$t('reset_password')
        })
      },
      submitForm: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.confirmLoading = true
            dataSource.memberResetPassword(this.form).then(data => {
              this.$message.success(this.$t('notice_edit_success'))
              this.open = false
            }).finally(() => {
              this.confirmLoading = false
            })
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
