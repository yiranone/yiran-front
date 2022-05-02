<template>
  <page-layout title="重要公告">
    <div slot="headerContent">
      <p>汇总内部账户余额</p>
    </div>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import {dataSource as ds} from '../../services/index'
  import {mapState} from 'vuex'
  export default {
    name: "Home",
    i18n: require('./i18n'),
    components: {PageLayout},
    data() {
      return {
        assetInfo: {},
        list: [],
        // websocket: websocket,
        loading: false,
        type: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    },

    created() {
    },

    computed: {
        ...mapState('account', ['innerAccountList'])
    },

    methods: {

    }
  }
</script>

<style lang="less" scoped>
  .reload {
    height: 50px;
    &-icon {
      font-size: 20px;
      &:hover {
        color: @primary-color;
        cursor: pointer;
      }
    }
  }
</style>
