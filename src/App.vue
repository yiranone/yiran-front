<template>
  <a-config-provider :locale="locale" id="app">
    <router-view/>
  </a-config-provider>
</template>

<script>
  import {enquireScreen} from './utils/util'
  import {mapState, mapMutations, mapActions} from 'vuex'
  import themeUtil from '@/utils/themeUtil';
  import {getI18nKey} from '@/utils/routerUtil'

  export default {
    name: 'App',
    data() {
      return {
        locale: {}
      }
    },
    created() {
      this.setHtmlTitle()
      this.setLanguage(this.lang)
      enquireScreen(isMobile => this.setDevice(isMobile))
    },
    mounted() {
      this.setWeekModeTheme(this.weekMode)
      // this.getWebsocketInfo()
    },
    beforeDestroy() {
      this.closeWebsocket()
    },
    watch: {
      weekMode(val) {
        this.setWeekModeTheme(val)
      },
      lang(val) {
        this.setLanguage(val)
      },
      $route() {
        this.setHtmlTitle()
      },
      'theme.mode': function (val) {
        let closeMessage = this.$message.loading(`您选择了主题模式 ${val}, 正在切换...`)
        themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage)
      },
      'theme.color': function (val) {
        let closeMessage = this.$message.loading(`您选择了主题色 ${val}, 正在切换...`)
        themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage)
      }
    },
    computed: {
      ...mapState('setting', ['theme', 'weekMode', 'lang'])
    },
    methods: {
      ...mapMutations('setting', ['setDevice']),
      // ...mapActions('account', ['getWebsocketInfo', 'closeWebsocket']),
      setWeekModeTheme(weekMode) {
        if (weekMode) {
          document.body.classList.add('week-mode')
        } else {
          document.body.classList.remove('week-mode')
        }
      },
      setLanguage(lang) {
        this.$i18n.locale = lang
        switch (lang) {
          case 'CN':
            this.locale = require('ant-design-vue/lib/locale-provider/zh_CN').default
            break
          case 'HK':
            this.locale = require('ant-design-vue/lib/locale-provider/zh_TW').default
            break
          case 'US':
          default:
            this.locale = require('ant-design-vue/lib/locale-provider/en_US').default
            break
        }
      },
      setHtmlTitle() {
        const route = this.$route
        const key = route.path === '/' ? 'admin' : route.matched.length > 0 ? getI18nKey(route.matched[route.matched.length - 1].path) : 'admin'
        document.title = process.env.VUE_APP_NAME + ' | ' + this.$t(key)
      },
    }
  }
</script>

<style lang="less" scoped>
  #id {
  }
</style>
