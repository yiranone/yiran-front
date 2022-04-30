<template>
  <div class="coin-info">
    <h1 class="name flex space-between"><strong>{{coinInfo.accountName}}</strong>
<!--      <a-link :loading="createCodeLoading" @click="handleType('createCode')">创建兑换码</a-link>--></h1>
    <div class="header flex vertical-center">
      <p class="coin-name">{{coinInfo.displayCurrencyName}}</p>
      <p :id="`coin_${coinIndex}`" class="coin-address flex-1">{{coinInfo.address}}</p>
      <p :id="`copybtn${coinIndex}`" :data-clipboard-target="`#coin_${coinIndex}`" @click="copy">
        <a-icon class="copy" style="fontSize: 18px" type="copy" /></p>
    </div>
    <div class="flex vertical-center space-between">
      <p class="total-balance"><span>总余额：</span><span>{{Number(coinInfo.totalAmount)}}</span></p>
      <p class="flex vertical-center">
        <span style="margin-right: 10px">自动归集</span>
        <a-switch :checked="enableAutoCollect" :loading="switchLoading" @click="handleSwitch"/></p>
    </div>
    <div class="balance-list flex space-between">
      <div class="item">
        <p>
          <span>可用余额</span>
          <a-icon class="refresh" @click="refresh" :type="loading ? 'loading' : 'reload'"/>
        </p>
        <p>{{Number(coinInfo.availableAmount)}}</p>
      </div>
      <div class="item"><p>冻结金额</p><p>{{Number(coinInfo.frozenAmount)}}</p></div>
      <div class="item"><p>未结服务费</p><p>{{Number(coinInfo.serviceAmount)}}</p></div>
      <div class="item"><p>未归集余额</p><p>{{Number(coinInfo.externalAmount)}}</p></div>
    </div>
    <a-row v-if="coinInfo.state != 'D'" type="flex" justify="end">
      <a-col :sm="{span: 12}" :xs="{span: 18}">
        <div class="process flex vertical-center horizontal-end">
          <p>归集进度</p>
          <p class="flex-1"><a-progress size="small" :percent="percent" /></p>
        </div>
      </a-col>
    </a-row>
    <div class="action flex space-between">
      <a-button type="primary"
                @click="handleType('rechange')">充币</a-button>
      <a-button type="primary"
                @click="handleType('withdraw')"
                :loading="withdrawLoading">提币</a-button>
      <a-button type="primary"
                @click="handleType('gather')"
                :disabled="coinInfo.state != 'D' || coinInfo.message == '归集结束'">
        {{coinInfo.message == '归集结束' ? '归集已完成' : '归集'}}</a-button>
    </div>
  </div>
</template>

<script>
  import Clipboard from 'clipboard'
  import {userService as us} from '../../services'
  import {dataSource as ds} from '../../services'
  export default {
    name: "CoinInfo",
    data() {
      return {
        loading: false,
        switchLoading: false,
        withdrawLoading: false,
        createCodeLoading: false
      }
    },
    props: {
      coinInfo: Object,
      coinIndex: Number
    },

    computed: {
      percent() {
        if (!this.coinInfo.totalCount) return 0;
        return Number(((this.coinInfo.alreadyDoneCount/this.coinInfo.totalCount)*100).toFixed(2))
      },

      enableAutoCollect() {
        return this.coinInfo.enableAutoCollect == undefined ? false : this.coinInfo.enableAutoCollect
      }
    },

    methods: {
      handleType(type) {
        if (!this.coinInfo.isPayPwd) {
          if (type === 'withdraw') {
            if(this.withdrawLoading) return;
            this.withdrawLoading = true
          } else if (type === 'createCode') {
            if(this.createCodeLoading) return;
            this.createCodeLoading = true
          }
          ds.sysAddressList({
            srcSys: this.coinInfo.srcSys,
            balanceId: this.coinInfo.balanceId
          }).then(res => {
            this.withdrawLoading = false
            this.createCodeLoading = false
            this.$emit('onType', type, {
              ...this.coinInfo,
              withdrawAddress: res.address,
              withdrawMin: res.withdrawMin,
              withdrawRate: res.withdrawRate,
              isPayPwd: res.isPayPwd
            })
          }).catch(res => {
            this.withdrawLoading = false
            this.createCodeLoading = false
          })
        } else {
          this.$emit('onType', type, this.coinInfo)
        }
      },

      copy() {
        let clipboard = new Clipboard(`#copybtn${this.coinIndex}`)
        clipboard.on('success', () => {
          this.$message.success(`复制成功`)
          clipboard.destroy()
        })
      },

      refresh() {
        if(this.loading) return;
        this.loading = true
        us.refreshInnerStatics({
          addressId: this.coinInfo.addressId,
          balanceId: this.coinInfo.balanceId,
          accountId: this.coinInfo.accountId,
          chain: this.coinInfo.chain,
          srcSys: this.coinInfo.srcSys,
          currency: this.coinInfo.currency
        }).then(res => {
          this.$message.success('刷新成功！')
          this.$emit('refresh', res)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },

      handleSwitch() {
        if(this.switchLoading) return;
        this.switchLoading = true
        us.autoCollect({
          balanceId: this.coinInfo.balanceId,
          value: this.coinInfo.enableAutoCollect == undefined  || !this.coinInfo.enableAutoCollect,
          srcSys: this.coinInfo.srcSys
        }).then(res => {
          this.$emit('refresh', res)
          this.switchLoading = false
        }).catch(() => {
          this.switchLoading = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .coin-info {
    .name {}
    .header {
      .coin-address {
        text-align: right;
        margin-right: 10px;
        margin-left: 30px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .copy:hover {
        cursor: pointer;
        color: @primary-color;
      }
    }
    .balance-list {
      .item {
        width: 30%;
        p {
          word-break: break-word;
        }
        span:first-child {
          margin-right: 10px;
        }
        .refresh {
          cursor: pointer;
          &:hover {
            color: @primary-color;
          }
        }
      }
    }
    .process {
      /*padding-left: 50%;*/
      /*box-sizing: border-box;*/
      p:first-child {
        font-size: 12px;
        margin-right: 10px;
        color: @primary-color;
      }
    }
  }
</style>
