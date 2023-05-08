<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar"/>
      <span class="name">{{user.userName}}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="$router.push('/person/center')">
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item @click="$router.push('/person/setting')">
        <a-icon type="setting" />
        <span>个人设置</span>
      </a-menu-item>
<!--  <a-menu-item @click="$router.push('/percenter')">
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item>-->
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import {mapGetters} from 'vuex'
import {userSource as us} from '@/services/index'
import {resetRouter} from "@/utils/routerUtil";

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  methods: {
    logout() {
      us.logout()
      resetRouter(this.$router)
      this.$store.commit('setting/resetState') //主要是清楚菜单
      this.$router.push('/login')
      //this.$router.replace({path: '/login'});
      //location.reload();
    }
  }
}
</script>

<style lang="less">
  .header-avatar{
    display: inline-flex;
    .avatar, .name{
      align-self: center;
    }
    .avatar{
      margin-right: 8px;
    }
    .name{
      font-weight: 500;
    }
  }
  .avatar-menu{
    width: 150px;
  }

</style>
