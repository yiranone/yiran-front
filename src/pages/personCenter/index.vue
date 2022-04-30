<template>
  <a-card class="per-center">
    <a-row>
      <a-col :md="{span: 7}" :xs="{span: 24}">
        <a-card class="box-shadow" size="small" title="个人信息">
          <userAvatar :user="user" />
          <div class="list-group">
            <div class="flex vertical-center"><a-icon type="user"/><span>用户名称</span><span class="flex-1">{{user.userName}}</span></div>
            <div class="flex vertical-center"><a-icon type="mobile"/><span>手机号</span><span class="flex-1">{{user.phoneNumber}}</span></div>
            <div class="flex vertical-center"><a-icon type="solution"/><span>角色</span><span class="flex-1">{{user.roleName}}</span></div>
            <div class="flex vertical-center"><a-icon type="calendar"/><span>创建日期</span><span class="flex-1">{{user.createTime}}</span></div>
          </div>
        </a-card>
      </a-col>
      <a-col :md="{span: 16, offset: 1}" :xs="{span: 24}">
        <a-card class="box-shadow">
          <a-tabs type="card" default-active-key="1">
            <a-tab-pane key="1" tab="设置资金密码">
              <asset-password />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
  // import PageLayout from '@/layouts/PageLayout'
  import userAvatar from "./userAvatar";
  import assetPassword from "./assetPassword";
  import {mapState} from 'vuex'

  export default {
    name: "index",
    components: { userAvatar, assetPassword },
    data() {
      return {

      }
    },
    computed: {
      ...mapState('account', ['user'])
    },
  }
</script>

<style lang="less" scoped>
  .per-center {
    .box-shadow {
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    .list-group {
      margin-top: 20px;
      >div {
        border-top: 1px solid rgba(0,0,0,.1);
        height: 40px;
        font-size: 13px;
        span:nth-child(2) {
          margin-left: 5px;
        }
        span:last-child {
          text-align: right;
        }
      }
    }
  }
</style>
