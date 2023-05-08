<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form-model
          layout="vertical"
          :rules="rules"
          :model="modifyUser"
          ref="form">
          <a-form-model-item label="登录账户" ref="loginName" prop="loginName">
            <a-input v-model="modifyUser.loginName" :disabled=true></a-input>
          </a-form-model-item>
          <a-form-model-item label="用户名" ref="userName" prop="userName">
            <a-input v-model="modifyUser.userName" placeholder="" :maxLength="30" />
          </a-form-model-item>
          <a-form-model-item label="手机" prop="phoneNumber">
            <a-input v-model="modifyUser.phoneNumber" placeholder="请填写手机号"/>
          </a-form-model-item>
          <a-form-model-item label="电子邮件" prop="email">
            <a-input v-model="modifyUser.email" placeholder="请填写邮箱"/>
          </a-form-model-item>
          <a-form-model-item label="性别" prop="sex">
            <a-radio-group v-model="modifyUser.sex">
              <a-radio :value="'0'">男</a-radio>
              <a-radio :value="'1'">女</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" :loading="submitLoading" @click="submit">保存</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(user)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="avatar"/>
        </div>
      </a-col>
    </a-row>
    <avatar-modal ref="modal" @ok="setAvatar"/>
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import {userSource} from '@/services'
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'BaseSettings',
  components: {
    AvatarModal
  },
  data () {
    return {
      submitLoading: false,
      //user: {},
      modifyUser: {},
      avatar:'',
      // option: {
      //   img: this.avatar,
      //   info: true,
      //   size: 1,
      //   outputType: 'png',
      //   canScale: false,
      //   autoCrop: true,
      //   // 只有自动截图开启 宽度高度才生效
      //   autoCropWidth: 180,
      //   autoCropHeight: 180,
      //   fixedBox: true,
      //   // 开启宽度和高度比例
      //   fixed: true,
      //   fixedNumber: [1, 1]
      // },
      rules: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请正确填写邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phoneNumber: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请正确填写手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    //...mapGetters('account', ['user']),
    ...mapGetters(['user'])
  },
  mounted () {
    this.getUser()
  },
  methods: {
    getUser () {
      userSource.getProfile().then(data => {
        console.info("查询profile返回：" + JSON.stringify(data))

        this.modifyUser = data
        // // debugger
        // console.info("user：" + this.user.sex)
        // console.info("user2：" + data.sex)
        //this.user.sexxx = data.sex
        this.user.avatar = data.avatar
        this.avatar = data.avatar
        console.info("合并profile返回：" + JSON.stringify(this.user))

        this.roleGroup = 'group'
        //this.postGroup = response.postGroup
      })
    },
    //设置头像回调
    setAvatar (url) {
      this.avatar = url
      this.user.avatar = url
    },
    submit () {
      this.submitLoading = true
      userSource.updateProfile(this.modifyUser).then(response => {

        this.user.loginName = this.modifyUser.loginName
        this.user.userName = this.modifyUser.userName
        this.user.phoneNuber = this.modifyUser.phoneNuber
        this.user.sex = this.modifyUser.sex == undefined ? '0' : this.modifyUser.sex

        this.$notification.open({
          message: '提示',
          description:
            '修改成功',
          icon: <a-icon type="check" style="color: #1890FF" />,
          duration: 3
        })
      }).finally(() => {
        this.submitLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
