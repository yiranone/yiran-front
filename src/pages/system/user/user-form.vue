<template>
  <a-modal :visible="open"
           :title="formTitle"
           :width="800"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="open = false"
           @ok="submitForm">
    <a-form-model ref="form" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-divider orientation="left">基本信息</a-divider>
      <a-form-model-item label="登录名称" prop="loginName">
        <a-input v-model="form.loginName" placeholder="请输入登录名称" />
      </a-form-model-item>
      <a-form-model-item label="头像" prop="avatar">
        <a-upload
          :customRequest="customImageRequest"
          list-type="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          @preview="handlePreview"
          @change="handleChange"
          :before-upload="beforeUpload"
        >
          <img v-if="avatar" :src="avatar"
            style="width: 100px; height: 100px; margin-right: 0px;"
          />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
          <!-- 仅上传一个 -->
          <!--<div v-if="fileList.length < 1">
            <a-icon type="plus" />

            <div class="ant-upload-text">Upload</div>
            <div class="ant-upload-text">步骤一</div>
            <div class="ant-upload-text">拖拽或上传原图片</div>

          </div>-->
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-model-item>
      <a-form-model-item label="用户名" prop="userName">
        <a-input v-model="form.userName" allowClear placeholder="请输入用户名"/>
      </a-form-model-item>
      <a-form-model-item label="手机号" prop="phoneNumber">
        <a-input v-model="form.phoneNumber" allowClear placeholder="请输入手机号"/>
      </a-form-model-item>
      <a-form-model-item label="邮箱" prop="email">
        <a-input v-model="form.email" allowClear placeholder=""/>
      </a-form-model-item>
      <a-form-model-item label="部门" prop="deptId">
        <a-tree-select
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="deptOptions"
            placeholder="请选择"
            :replaceFields="replaceFields"
            tree-default-expand-all
            v-model="form.deptId"
        >
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item label="渠道" prop="channelId">
        <a-select placeholder="请选择"
                  :disabled="formTitle != '新增用户'"
                  v-model="form.channelId">
          <a-select-option v-for="(d, index) in channelOptions" :key="index" :value="d.channelId" >{{ d.channelName }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="用户状态" prop="status">
        <a-radio-group v-model="form.status" button-style="solid">
          <a-radio-button v-for="(d, index) in statusOptions" :key="index" :value="d.value" >{{ d.label }}</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-divider orientation="left" v-if="hasPermission('system:role:view') || hasPermission('system:role:edit')">权限</a-divider>
      <a-form-model-item label="角色" :colon="false" prop="roleIds"  v-if="hasPermission('system:role:view') || hasPermission('system:role:edit')">
        <a-checkbox-group v-model="form.roleIds">
          <a-checkbox v-for="(role,index) in roleList"
                      :key="`role_${index}`" :value="role.roleId">{{role.roleName}}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-model-item>
      <a-form-model-item v-if="formTitle == '新增用户'" label="密码" prop="password">
        <a-input-password v-model="form.password" allowClear placeholder="请输入登录密码"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

import {dataSource} from '@/services/index'
import {validateEmail} from "@/utils/validate";
import { metadataSource } from '../../../services';
  export default {
    name: "user-form",
    components: {},
    props: {
      channelOptions:{},
      deptOptions: {
        type: Array,
        required: true
      },
      statusOptions: {
        type: Array,
        required: true
      },
      sexOptions: {
        type: Array,
        required: true
      },
      roleList: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        labelCol: { // 24格栅格系统，label所占为 a
          xxl: 5, // ≥1600px 响应式栅格
          xl: 8, // ≥1200px 响应式栅格
          lg: 10, // ≥992px 响应式栅格
          md: 12 // ≥768px 响应式栅格
        },
        wrapperCol: { // 24格栅格系统，label后面内容所占为 24-a
          xxl: 19,
          xl: 16,
          lg: 14,
          md: 12
        },
        form: {},
        formTitle: '',
        confirmLoading: false,
        open: false,
        previewVisible: false,
        previewImage: "",
        loading: false,
        avatar: '',
        rules: {
          loginName: [{ required: true, message: '登录名称不能为空', trigger: 'blur' }],
          phoneNumber: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
          username: [{ required: true, message: '会员名称不能为空', trigger: 'blur' }],
          deptId: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
          channelId: [{ required: true, message: '渠道不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
          status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            {
              validator: validateEmail,
              trigger: ['blur']
            }
          ],
        },
        roleIds: [],
        replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
      }
    },
    methods: {
      handleCancel() {
        this.previewVisible = false;
      },
      async handlePreview(file) {
        console.info("handlePreview:" + JSON.stringify(file))
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
      },
      handleChange(info) {
        if (info.file.status === 'uploading') {
          this.loading = true;
          console.info("handleChange1 :")
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl => {
            console.info("handleChange2 上传图片:" + imageUrl)
            //this.imageUrl = imageUrl;
            //this.loading = false;
          });
        }
      },
      beforeUpload(file) {
        // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        // if (!isJpgOrPng) {
        //   this.$message.error('You can only upload JPG file!');
        // }
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //   this.$message.error('Image must smaller than 2MB!');
        // }
        // return isJpgOrPng && isLt2M;

        return new Promise(async (resolve, reject) => {
          console.info("beforeUpload:" + JSON.stringify(file))
          if (!file.type.includes('image')) {
            this.$message.warning('请上传图片')
            reject(new Error('请上传图片'))
            return
          }
          this.isShowSpinning = true
          const newFile = await this.compressImg(file)
          resolve(newFile)
        })
      },
      customImageRequest({action,file,onSuccess,onError,onProgress}) {
        console.info("上传图片file:" + JSON.stringify(file))
        // blob方式预览图片
        // 组装数据
        this.avatar = null;
        this.loading = true;
        const formData = new FormData()
        formData.append('file', file, file.fileName)
        metadataSource.uploadFile(formData).then(response => {
          this.loading = false;
          this.form.avatar = response.url
          this.avatar = window.URL.createObjectURL(file)
          console.info("图片上传成功" + response.url + ",this.avatar:" + this.avatar)
          this.$message.success('上传成功')
        })
      },
      // base64转码（压缩完成后的图片为base64编码，这个方法可以将base64编码转回file文件）
      dataURLtoFile (dataurl, filename) {
        var arr = dataurl.split(',')
        var mime = arr[0].match(/:(.*?);/)[1]
        var bstr = atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
      },
      // 图片压缩函数
      compressImg (file) {
        const that = this
        var files
        var fileSize = parseFloat(parseInt(file['size']) / 1024 / 1024).toFixed(2)
        var read = new FileReader()
        read.readAsDataURL(file)
        return new Promise(function (resolve, reject) {
          read.onload = function (e) {
            var img = new Image()
            img.src = e.target.result
            img.onload = function () {
              // 默认按比例压缩
              var w = this.width
              var h = this.height
              // 生成canvas
              var canvas = document.createElement('canvas')
              var ctx = canvas.getContext('2d')
              var base64
              // 创建属性节点
              canvas.setAttribute('width', w)
              canvas.setAttribute('height', h)
              ctx.drawImage(this, 0, 0, w, h)
              if (fileSize < 1) {
                // 如果图片小于一兆 那么压缩0.5
                base64 = canvas.toDataURL(file['type'], 0.5)
              } else if (fileSize > 1 && fileSize < 2) {
                // 如果图片大于1M并且小于2M 那么压缩0.5
                base64 = canvas.toDataURL(file['type'], 0.5)
              } else {
                // 如果图片超过2m 那么压缩0.2
                const zx = 1/fileSize //压缩到1
                console.info("文件大小超过2等于"+fileSize+",压缩比例:"+zx)
                base64 = canvas.toDataURL(file['type'], zx)
              }
              // 回调函数返回file的值（将base64编码转成file）
              files = that.dataURLtoFile(base64, file.name) // 如果后台接收类型为base64的话这一步可以省略
              resolve(files)
            }
          }
        })
      },

      onClose () {
        this.open = false
      },
      // 取消按钮
      cancel () {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset () {
        this.form = {
          status: '0'
        }
      },
      handleAdd () {
        this.reset()
        this.open = true
        this.formTitle = '新增用户'
      },
      /** 修改按钮操作 */
      handleUpdate (row, ids) {
        this.reset()
        const userId = row ? row.userId : ids[0]
        dataSource.userDetail({"userId":userId}).then(data => {
          this.form = data
          this.avatar=data.avatar
          this.open = true
          this.formTitle = '修改用户'
        })
      },
      submitForm: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.confirmLoading = true
            if (this.form.userId !== undefined) {
              dataSource.userEdit(this.form).then(data => {
                this.$message.success('修改成功')
                this.open = false
                this.$emit('ok')
              }).finally(() => {
                this.confirmLoading = false
              })
            } else {
              dataSource.userAdd(this.form).then(data => {
                this.$message.success('新增成功')
                this.open = false
                this.$emit('ok')
              }).finally(() => {
                this.confirmLoading = false
              })
            }
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>

</style>

