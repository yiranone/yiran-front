<template>
  <page-layout title="重要公告">
    <div slot="headerContent">
      <p>ETH或者ERC20交易一直广播中，解决办法</p>
      <p>建议用户使用 【get_eth_gasprice】接口获取以太坊网络Gas价格</p>
    </div>
    <template slot="action"><a href="#">查看更多</a></template>
    <div style="padding: 0 10px 20px 10px;background: #ffffff">
      <a-spin :spinning="loading">
        <div class="reload flex vertical-center horizontal-end">
          <a-icon class="reload-icon" type="reload" @click="getList"/></div>
        <a-row type="flex" justify="space-between">
          <a-col :xl="11" :lg="24" :md="24" :sm="24" :xs="24" v-for="(item, index) in innerAccountList" :key="index">
            <a-card style="margin-bottom: 20px;box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);" :bordered="false">
              <coin-info :coin-info="item" :coin-index="index" @onType="onType" @refresh="onRefresh"/>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
      <a-pagination v-model="pageNum"
                    :pageSize.sync="pageSize"
                    :total="total"
                    showQuickJumper
                    showSizeChanger
                    show-less-items
                    :showTotal="(total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`"
                    @change="handlePageChange"
                    @showSizeChange="handlePageSizeChange"
                    />
    </div>
    <rechange-modal :visible="rechangeVisible" :asset-info="assetInfo" @cancle="rechangeVisible = false"/>
    <gather-modal :visible="gatherVisible" @cancle="gatherVisible = false" :asset-info="assetInfo"/>
    <withdraw-modal :visible="withdrawVisible" @cancle="withdrawVisible = false" :asset-info="assetInfo"/>
    <set-pay-pwd :visible="setPayPwdVisible" :asset-info="assetInfo" @cancle="setPayPwdVisible = false" @success="setPayPwdSuccess"/>
    <create-code :visible.sync="createCodeVisible" :asset-info="assetInfo" />
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import CoinInfo from './CoinInfo'
  import RechangeModal from './rechargeModal'
  import GatherModal from './getherModal'
  import WithdrawModal from './withdrawModal'
  import SetPayPwd from './setPayPwd'
  import CreateCode from './createCode'
  import {dataSource as ds} from '../../services/index'
  import websocket from '../../utils/websocket'
  import {mapState} from 'vuex'
  export default {
    name: "Home",
    i18n: require('./i18n'),
    components: {PageLayout, CoinInfo, RechangeModal, GatherModal, WithdrawModal, SetPayPwd, CreateCode},
    data() {
      return {
        rechangeVisible: false,
        gatherVisible: false,
        withdrawVisible: false,
        setPayPwdVisible: false,
        createCodeVisible: false,
        coinAddress: '',
        assetInfo: {},
        list: [],
        websocket: websocket,
        loading: false,
        type: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    },

    created() {
      this.getList()
    },

    computed: {
        ...mapState('account', ['innerAccountList'])
    },

    methods: {
      async getList() {
        this.loading = true
        await ds.innerAccountBlanceList({pageNum: this.pageNum, pageSize: this.pageSize, showOnHomePage: true})
            .then(res => {
              this.total = res.count
              this.$store.state.account.innerAccountList = res.rows
            })
        this.loading = false
      },

      onType(type, obj) {
        this.type = type
        if (type === 'withdraw' || type === 'createCode') {
          this.onRefresh(obj)
          this.assetInfo = obj
          if (!this.assetInfo.isPayPwd) {
            this.setPayPwdVisible = true
            return
          }
        }
        this.assetInfo = obj
        this[`${type}Visible`] = true
      },

      onRefresh(data) {
        for (let i = 0; i < this.innerAccountList.length; i++) {
          if (this.innerAccountList[i].balanceId == data.balanceId) {
            this.$store.state.account.innerAccountList[i] = {...this.innerAccountList[i], ...data}
            break
          }
        }
        this.$store.state.account.innerAccountList = [...this.innerAccountList]
      },

      handleCreateCode(obj) {
        this.assetInfo = obj
        this.createCodeVisible = true
      },

      setPayPwdSuccess() {
        this.assetInfo.isPayPwd = true
        this.onRefresh(this.assetInfo)
        this.setPayPwdVisible = false
        this[`${this.type}Visible`] = true
      },

      handlePageChange(page) {
        this.pageNum = page
        this.getList()
      },

      handlePageSizeChange(page, size) {
        this.pageSize = size
        this.pageNum = 1
        this.getList()
      }
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
