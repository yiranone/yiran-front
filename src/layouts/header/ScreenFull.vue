<template>
  <a-tooltip title="全屏">
    <a-icon :style="{fontSize: '18px'}" @click="toggleScreen" class="action" :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" />
  </a-tooltip>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    toggleScreen() {
      console.log(screenfull)
      if (!screenfull.isEnabled) {
        this.$message.warning('you browser can not work')
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>

</style>
