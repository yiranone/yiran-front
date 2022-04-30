<template>
  <div class="type-set">
    <a-tooltip title="刷新">
      <a-icon @click="refresh" class="action" :type="loading ? 'loading' : 'reload'"/>
    </a-tooltip>
    <!--<action-size v-model="sSize" class="action" />-->
    <div class="action-size" ref="root">
      <a-tooltip title="密度">
        <a-dropdown placement="bottomCenter" :trigger="['click']" :get-popup-container="() => $refs.root">
          <a-icon class="action" type="column-height"/>
          <a-menu :selected-keys="[colSize]" slot="overlay" @click="changeColSize">
            <a-menu-item key="default">
              默认
            </a-menu-item>
            <a-menu-item key="middle">
              中等
            </a-menu-item>
            <a-menu-item key="small">
              紧密
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-tooltip>
    </div>
  </div>
</template>

<script>
  export default {
    name: "type-set",

    inject: ['parent'],

    props: {
      colSize: {
        type: String,
        default: 'middle'
      },
      loading: Boolean
    },

    methods: {
      refresh() {
        this.$emit('refresh')
      },

      changeColSize({key}) {
        this.$emit('changeSize', key)
      }
    }
  }
</script>

<style lang="less" scoped>
  .type-set {
    text-align: right;
    font-size: 17px;
    color: @text-color;
    .action {
      margin: 0 8px;
      cursor: pointer;
      &:hover {
        color: @primary-color;
      }
      &-size {
        display: inline-block;
      }
    }
  }
</style>
