import { mapState } from 'vuex'

const baseMixin = {
  computed: {
    ...mapState({
      layout: state => state.setting.isMobile,
      navTheme: state => state.setting.theme,
      primaryColor: state => state.setting.color,
      fixedHeader: state => state.setting.fixedHeader,

      isMobile: state => state.setting.isMobile,
      hideFooter: state => state.setting.hideFooter
    }),
    isTopMenu () {
      return this.layout === 'topmenu'
    }
  },
  methods: {
    isSideMenu () {
      return !this.isTopMenu
    }
  }
}

export {
  baseMixin
}
