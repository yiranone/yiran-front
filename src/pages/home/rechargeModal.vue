<template>
  <a-modal :visible="visible" :footer="null" :destroyOnClose="true" @cancel="hanldeCancle">
    <div class="flex direction-column vertical-center">
      <div class="qrcode"><img :src="qrcode" alt=""></div>
      <p id="coinAddress">{{assetInfo.address}}</p>
      <a-button id="copyBtn" data-clipboard-target="#coinAddress" @click="copy">复制</a-button>
    </div>
  </a-modal>
</template>

<script>
  import QR from '../../utils/qrcode'
  import Clipboard from 'clipboard'
  export default {
    name: "rechargeModal",
    data() {
      return {

      }
    },
    props: {
      visible: Boolean,
      assetInfo: {
        type: Object,
        default: () => ({})
      }
    },

    computed: {
      qrcode() {
        if (this.assetInfo.address) {
          return QR.createQrCodeImg(this.assetInfo.address)
        }
        return ''
      }
    },

    methods: {
      hanldeCancle() {
        this.$emit('cancle')
      },

      copy() {
        let clipboard = new Clipboard('#copyBtn')
        clipboard.on('success', () => {
          this.$message.success(`复制成功`)
          clipboard.destroy()
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