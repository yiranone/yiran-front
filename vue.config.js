let path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const {getThemeColors, modifyVars} = require('./src/utils/themeUtil')
const {resolveCss} = require('./src/utils/theme-color-replacer-extend')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const productionGzipExtensions = ['js', 'css']
const isProd = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, dir)
}

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    nprogress: 'NProgress',
    clipboard: 'ClipboardJS',
    '@antv/data-set': 'DataSet',
    'js-cookie': 'Cookies'
  },
  css: [],
  js: [
    // '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    // '//cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
    // '//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
    // '//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
    // '//cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
    // '//cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js',
    // '//cdn.jsdelivr.net/npm/@antv/data-set@0.11.4/build/data-set.min.js',
    // '//cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js',
    './js/vue.min.js',
    './js/vue-router.min.js',
    './js/vuex.min.js',
    './js/axios.min.js',
    './js/nprogress.min.js',
    './js/clipboard.min.js',
    './js/data-set.min.js',
    './js/js.cookie.min.js'
  ]
}

module.exports = {
  devServer: {
    proxy: {
      '/api': { //此处要与 /services/api.js 中的 API_PROXY_PREFIX 值保持一致
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
    }
  },
  configureWebpack: config => {
    config.entry.app = ["babel-polyfill", "whatwg-fetch", "./src/main.js"];
    config.performance = {
      hints: false
    }
    config.plugins.push(
        new ThemeColorReplacer({
          fileName: 'css/theme-colors-[contenthash:8].css',
          matchColors: getThemeColors(),
          injectCss: true,
          resolveCss
        })
    )
    // Ignore all locale files of moment.js
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    // 生产环境下将资源压缩成gzip格式
    if (isProd) {
      // add `CompressionWebpack` plugin to webpack plugins
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
    }
    // if prod, add externals
    if (isProd) {
      config.externals = assetsCDN.externals
    }
  },
  chainWebpack: config => {
    // config.resolve.alias.set('@', resolve('src'));
    // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
    if (isProd) {
      config.plugin('optimize-css')
          .tap(args => {
            args[0].cssnanoOptions.preset[1].colormin = false
            return args
          })
    }
    // 生产环境下使用CDN
    if (isProd) {
      config.plugin('html')
          .tap(args => {
            args[0].cdn = assetsCDN
            return args
          })
    }

    // 清除svg默认配置对./src/icons文件夹的处理
    config.module
        .rule("svg")
        .exclude.add(path.resolve(__dirname, ("src/assets/icons"))) // icons存放地（svg放的地方）
        .end()

    // 添加新的rule处理./src/icons文件夹的svg文件
    config.module
        .rule("svg-sprite")
        .test(/\.svg$/)
        .include
        .add(path.resolve(__dirname, ("src/assets/icons")))
        .end()
        .use("svg-sprite-loader")
        .loader("svg-sprite-loader")
        .options({
          symbolId: "icon-[name]",
          include: ["src/assets/icons"]
        })
        .end()
        .before("svg-sprite-loader")
        .use("svgo-loader")
        .loader("svgo-loader")
        .options({
          plugins: [
            {removeAttrs: {attrs: "path:fill"}}
          ]
        })
        .end()
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: modifyVars(),
          javascriptEnabled: true
        }
      }
    }
  },
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false
}
