<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconNames"></use>
  </svg>
</template>

<script>
  export default {
    name: 'svg-icon',
    props: {
      iconName: {
        type: String,
        required: true
      },
      className: {
        type: String
      }
    },
    computed: {
      iconNames () {
        return `#icon-${this.iconName}`;
      },
      svgClass () {
        if (this.className) {
          return 'svg-icon ' + this.className;
        } else {
          return 'svg-icon';
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor; //此属性为更改svg颜色属性设置
    stroke: currentColor;
    overflow: hidden;
  }
</style>