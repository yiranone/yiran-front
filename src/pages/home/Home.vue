<template>
  <page-layout title="重要公告">
    <div slot="headerContent">
      <p>汇总</p>
      <p>{{$t('user.info')}} : 123</p>
      <p>用户信息：{{user}}</p>

      <p>权限信息：{{permissions}}</p>

      <p>query: {{$route.query}}</p>
      <p>params: {{$route.params}}</p>

<!--      <a-button @click="updateUser">HHHH</a-button> -->
    </div>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import {dataSource as ds} from '../../services/index'
  import {mapGetters, mapState} from 'vuex'
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
       //...mapState('account', ['innerAccountList']),
       // ...mapGetters('account',['user']),
       // ...mapState('account', ['user']),
       // ...mapGetters('account',['permissions'])
       ...mapGetters(['user','permissions'])
    },

    methods: {


      updateUser () {
        console.info("click")
        this.user.avatar = new Date().toTimeString()
      },

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
