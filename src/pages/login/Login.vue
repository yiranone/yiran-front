<template>
  <common-layout>
    <div class="top">
      <div class="header">
<!--
        <img alt="logo" class="logo" src="@/assets/img/logo.png"/>
-->
          <img v-if="loginConfig.logo != null && loginConfig.logo != ''" alt="logo" class="logo" :src="loginConfig.logo"/>
        <span class="title">{{loginConfig.displayName}}</span>
      </div>
      <div class="desc"></div>
    </div>
    <div class="login">
      <a-form-model ref="form" :model="form" :rules="rules">
        <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;"/>
        <a-form-model-item prop="name">
          <a-input v-model="form.name"
              autocomplete="autocomplete"
              size="large"
              placeholder="请输入账户名">
            <a-icon slot="prefix" type="user"/>
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input v-model="form.password"
              size="large"
              placeholder="请输入密码"
              autocomplete="autocomplete"
              type="password">
            <a-icon slot="prefix" type="lock"/>
          </a-input>
        </a-form-model-item>
        <!--<a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
          <a-tab-pane tab="账户密码登录" key="1">

          </a-tab-pane>
          <a-tab-pane tab="手机号登录" key="2">
            <a-form-item>
              <a-input size="large" placeholder="mobile number" >
                <a-icon slot="prefix" type="mobile" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input size="large" placeholder="captcha">
                    <a-icon slot="prefix" type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px">
                  <a-button style="width: 100%" class="captcha-button" size="large">获取验证码</a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>-->
        <!--<div>
          <a-checkbox :checked="true" >自动登录</a-checkbox>
          <a style="float: right">忘记密码</a>
        </div>-->
        <a-form-item>
          <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large"
                    htmlType="submit" @click="loginButton"
                    type="primary">登录
          </a-button>
        </a-form-item>
<!--        <div>
          其他登录方式
          <a-icon class="icon" type="alipay-circle" />
          <a-icon class="icon" type="taobao-circle" />
          <a-icon class="icon" type="weibo-circle" />
          <router-link style="float: right" to="/dashboard/workplace" >注册账户</router-link>
        </div>-->
<!--
        <button class="result_btn" @click.prevent="showBox">验证码</button>
-->
      </a-form-model>
    </div>
    <!-- blockPuzzle  clickWord -->
    <Verify
        ref="verify"
        :captcha-type="captcha"
        :mode="'pop'"
        :img-size="{width:'400px',height:'200px'}"
        @success="verifySuccess"
    />
  </common-layout>
</template>

<script>
  import CommonLayout from '@/layouts/CommonLayout'
  import Verify from '@/components/verifition/Verify'
  import {userSource as us} from '@/services'
  import {setAuthorization} from '@/utils/request'
  import {mapMutations, mapActions, mapGetters} from 'vuex'
  import {loadRoutes, loadGuards, loadPermissions, loadAllDictTypes} from '../../utils/routerUtil'

  export default {
    name: 'Login',
    components: {CommonLayout,Verify},
    data() {
      return {
        logging: false,
        error: '',
        captchaVerification: '',
        form:{},
        captcha:'none',
        rules: {
          name: [{ required: true, message: '登录名称不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', whitespace: true, trigger: 'blur' }]
        }
      }
    },
    created() {
        //去服务器获取配置，当前是否配置了验证码登录校验
      console.info("请求渠道配置，验证码，后台logo等等")
      us.loginConfig().then(data => {
        console.info("服务器配置" + JSON.stringify(data))
        this.captcha = data.captcha
          this.setLoginConfig(data)
      })
    },
    computed: {
        ...mapGetters('account', ['loginConfig']),
        systemName() {
          return this.$store.state.setting.systemName
        }
    },

    mounted() {
      // this.closeWebsocket()
    },
    methods: {
      ...mapMutations('account', ['setUser', 'setLoginConfig','setPermissions', 'setRoles']),
      // ...mapActions('account', ['getWebsocketInfo', 'closeWebsocket']),
      verifySuccess(d){
        console.info("验证码验证返回"+JSON.stringify(d))
        this.captchaVerification = d.captchaVerification
        this.login()
      },
      showBox(){
        //当mode="pop"时,调用组件实例的show方法显示组件
        this.$refs.verify.show();
      },
      loginButton() {
        console.info("点击登录按钮"+this.captcha)
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.captcha != 'none') {
              this.showBox()
            } else {
              this.login()
            }
          }
        })
      },
      login() {
        console.info("用户登录",this.form.name)
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.logging = true
            const name = this.form.name
            const password = this.form.password
            const captchaVerification = this.captchaVerification
            us.login(name, password,captchaVerification)
                .then(this.afterLogin)
                .catch(err => {
                  if (err.msg) this.error = err.msg
                  this.logging = false
                })
          } else {
            return false
          }
        })
      },
      async afterLogin(res) {
        // const {user, permissions, roles} = res
        console.info("设置登录用户" + JSON.stringify(res))
        this.setUser(res)
        // debugger

        //this.setPermissions(permissions)
        // this.setRoles(roles)
        setAuthorization({token: res.token})
        // 获取路由配置
        console.info("加载路由配置")
        await loadAllDictTypes(this.$router,this.$store,this.$i18n)
        console.info("设置登录用户的权限")
        await loadPermissions(this.$router,this.$store,this.$i18n)
        await loadRoutes({router: this.$router, store: this.$store, i18n: this.$i18n})
        // this.getWebsocketInfo()
        await this.$router.push('/home')
        this.logging = false
        this.$message.success('登录成功，欢迎回来', 5)
      }
    }
  }
</script>

<style lang="less" scoped>
  .common-layout {
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login {
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button {
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
