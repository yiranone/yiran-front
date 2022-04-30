<template>
  <a-modal :visible="visible" :destroyOnClose="true" @cancel="hanldeCancle">
    <template slot="footer">
      <a-button key="back" @click="hanldeCancle">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <p>归集要产生矿工费，请提前预留</p>
  </a-modal>
</template>

<script>
  import QR from '../../utils/qrcode'
  import {userService as us} from '../../services'
  export default {
    name: "gatherModal",
    data() {
      return {
        loading: false
      }
    },
    props: {
      visible: Boolean,
      coinAddress: String,
      assetInfo: Object
    },

    computed: {
      qrcode() {
        return QR.createQrCodeImg(this.coinAddress)
      }
    },

    methods: {
      hanldeCancle() {
        this.$emit('cancle')
      },

      handleOk() {
        this.loading = true
        us.gatherAllMoney({
          balanceId: this.assetInfo.balanceId,
          amount: this.assetInfo.availableAmount,
          innerId: this.assetInfo.accountId,
          chain: this.assetInfo.chain,
          currency: this.assetInfo.currency,
          srcSys: this.assetInfo.srcSys
        }).then(res => {
          this.loading = false
          this.$message.success('归集成功')
          this.hanldeCancle()
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .qrcode {
    width: 150px;
    height: 150px;
    /*margin: 0 auto 20px auto;*/
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    text-align: center;
  }
</style>
