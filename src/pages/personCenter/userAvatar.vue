<template>
  <div class="flex horizontal-center">
    <a-avatar :src="options.img" @click="editCropper()" :size="120" alt="请上传头像"/>
    <a-modal :title="title" :visible="open" :width="800" :footer="null" :afterClose="afterClose"  @cancel="handleCancel">
      <a-row>
        <a-col :xs="24" :md="12" :style="{height: '350px'}">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            @realTime="realTime"
          />
        </a-col>
        <a-col :xs="24" :md="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </a-col>
      </a-row>
      <br />
      <a-row type="flex">
        <a-col :md="{span: 2}" :xs="{span: 6}">
          <a-upload action="#" :custom-request="requestUpload" :show-upload-list="false" :before-upload="beforeUpload">
            <a-button>
              上传
              <a-icon type="upload" />
            </a-button>
          </a-upload>
        </a-col>
        <a-col :md="{span: 1, offset: 2}" :xs="{span: 3, offset: 2}">
          <a-button icon="plus" @click="changeScale(1)"></a-button>
        </a-col>
        <a-col :md="{span: 1, offset: 1}" :xs="{span: 3, offset: 1}">
          <a-button icon="minus" @click="changeScale(-1)"></a-button>
        </a-col>
        <a-col :md="{span: 1, offset: 1}" :xs="{span: 3, offset: 1}">
          <a-button icon="undo" @click="rotateLeft()"></a-button>
        </a-col>
        <a-col :md="{span: 1, offset: 1}" :xs="{span: 3, offset: 1}">
          <a-button icon="redo" @click="rotateRight()"></a-button>
        </a-col>
        <a-col :md="{span: 2, offset: 6}" :xs="{span: 6, offset: 10}">
          <a-button type="primary" @click="uploadImg()">提 交</a-button>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import store from "@/store";
import { VueCropper } from "vue-cropper";
// import { uploadAvatar } from "@/api/system/user";

export default {
  components: { VueCropper },
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,
      // 弹出层标题
      title: "修改头像",
      options: {
        img: this.user.avatar, //裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true // 固定截图框大小 不允许改变
      },
      previews: {}
    };
  },
  methods: {
    // 编辑头像
    editCropper() {
      this.open = true;
    },
    // 打开弹出层结束时的回调
    modalOpened() {
      this.visible = true;
    },
    // 覆盖默认的上传行为
    requestUpload() {
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf("image/") == -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.options.img = reader.result;
        };
      }
    },
    // 上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob(data => {
        let formData = new FormData();
        formData.append("avatarfile", data);
        /*uploadAvatar(formData).then(response => {
          this.open = false;
          this.options.img = process.env.VUE_APP_BASE_API + response.imgUrl;
          store.commit('SET_AVATAR', this.options.img);
          this.msgSuccess("修改成功");
          this.visible = false;
        });*/
      });
    },
    // 实时预览
    realTime(data) {
      this.previews = data;
    },

    afterClose() {
      this.open = false
    },

    handleCancel() {
      this.open = false
    },
  }
};
</script>
<style lang="less" scoped>
  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;
  }
</style>
