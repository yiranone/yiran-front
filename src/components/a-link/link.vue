<template>
  <a-spin :spinning="loading">
    <a-icon slot="indicator" type="loading" spin />
    <a :href="href" :style="{color: color}" @click="handleClick"><slot></slot></a>
  </a-spin>
</template>

<script>
export default {
  props: {
    href: String,
    type: {
      type: String,
      default: ''
    },
    loading: Boolean
  },

  computed: {
    color() {
      switch (this.type) {
        case 'primary':
          return '#1890ff'
        case 'danger':
          return '#ff4d4f'
        case 'warning':
          return '#E6A23C'
        default: return '#000000'
      }
    }
  },

  methods: {
    handleClick(e) {
      e.preventDefault()
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
  a {
    font-size: 15px;
  }
  a:hover {
    color: #1890ff !important;
  }
</style>