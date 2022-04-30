<template>
  <a-modal :visible="visible"
           title="充值详细"
           :width="850"
           @cancel="parent.detailVisible = false"
           :destroyOnClose="true"
           :footer="null"
           @ok="parent.detailVisible = false"
           :afterClose="afterClose">
    <svg-icon style="width: 30px;height: 30px;" slot="closeIcon" icon-name="close"/>
    <a-row>
      <a-col :md="{offset: 5}">
        <div class="cell flex"><p>链名称：</p><p class="flex-1">{{detailInfo.chain}}</p></div>
        <div class="cell flex"><p>币名称：</p><p class="flex-1">{{detailInfo.currency}}</p></div>
        <div class="cell flex"><p>区块号：</p><p class="flex-1">{{detailInfo.txnBlock}}</p></div>
        <div class="cell flex"><p>交易ID：</p><p class="flex-1">{{detailInfo.txnId}}</p></div>
        <div class="cell flex"><p>交易HASH号：</p><p class="flex-1">{{detailInfo.txnHash}}</p></div>
        <div class="cell flex"><p>交易类型：</p><p class="flex-1">{{detailInfo.type}}</p></div>
        <div class="cell flex"><p>交易金额：</p><p class="flex-1">{{detailInfo.amount}}</p></div>
        <div class="cell flex"><p>交易时间：</p><p class="flex-1">{{detailInfo.createTime}}</p></div>
        <div class="cell flex"><p>状态：</p><p class="flex-1">{{detailInfo.status}}</p></div>
        <div class="cell flex"><p>原因：</p><p class="flex-1">{{detailInfo.message}}</p></div>
        <div class="cell flex"><p>出资账户：</p><p class="flex-1">{{detailInfo.fromAccount}}</p></div>
        <div class="cell flex"><p>出资地址：</p><p class="flex-1">{{detailInfo.fromAddress}}</p></div>
        <div class="cell flex"><p>入资账户：</p><p class="flex-1">{{detailInfo.toAccount}}</p></div>
        <div class="cell flex"><p>入资地址：</p><p class="flex-1">{{detailInfo.toAddress}}</p></div>
        <div class="cell flex"><p>余额：</p><p class="flex-1">{{detailInfo.latestBalance}}</p></div>
        <div class="cell flex"><p>账户标识：</p><p class="flex-1">{{detailInfo.srcSys}}</p></div>
        <div class="cell flex"><p>更新时间：</p><p class="flex-1">{{detailInfo.updateTime}}</p></div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
  export default {
    inject: ['parent'],
    props: {
      detailInfo: Object
    },
    computed: {
      visible() {
        return this.parent.detailVisible
      }
    },
    methods: {
      afterClose() {

      }
    }
  }
</script>

<style lang="less" scoped>
  .cell {
    p {
      &:first-child {
        width: 100px;
        margin-right: 20px;
        text-align: right;
      }
      &:last-child {
        word-break: break-word;
      }
    }
  }
</style>
