<template>
  <page-layout title=" ">
    <div slot="headerContent" style="width: 100%">
      <query :conditions="conditions" @onQuery="onQuery" :loading="loading"/>
    </div>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import Query from './query'
  import {dataSource as ds} from '../../../services/index'

  export default {
    components: {PageLayout, Query},
    data() {
      return {
        loading: false,
        conditions: {
          chain:'TRX',
          currency: 'TRX'
        } //查询条件
      }
    },

    provide() {
      return {
        parent: this
      }
    },

    methods: {
      async getList() {
        this.loading = true
        await ds.queryTransactionByTxnHash({...this.conditions})
            .then(() => {
              this.$message.success('发送成功！')
            }).catch(() => {})
        this.loading = false
      },

      onQuery(conditions) {
        this.conditions = {...this.conditions, ...conditions}
        this.getList()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
