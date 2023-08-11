<template>
  <a-modal :visible="open"
           :title="formTitle"
           :width="1000"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="open = false"
           @ok="submitForm">
    <a-form-model ref="form" :model="form" :rules="rules"  :label-col="{span:6}" :wrapper-col="{span:16}">
      <a-form-model-item label="渠道名称" prop="channelName">
        <a-input v-model="form.channelName" placeholder="请输入" :disabled="formTitle == '修改渠道'"/>
      </a-form-model-item>
      <a-form-model-item label="渠道编码" prop="channelCode">
        <a-input v-model="form.channelCode" placeholder="请输入" :disabled="formTitle == '修改渠道'"/>
      </a-form-model-item>
      <a-form-model-item label="排序" prop="channelSort">
        <a-input v-model="form.channelSort" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="有效期" prop="expireDate">
        <a-date-picker v-model="form.expireDate" format="YYYY-MM-DD"/>
      </a-form-model-item>
        <a-form-model-item label="网站logo" prop="logo">
            <a-upload
                    :customRequest="customImageRequest"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :showUploadList="false"
                    :before-upload="beforeUpload1"
            >
                <img v-if="logo" :src="logo"
                     style="width: 100px; height: 100px; margin-right: 0px;"
                />
                <div v-else>
                    <a-icon :type="loading1 ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                        Upload
                    </div>
                </div>
            </a-upload>

        </a-form-model-item>
        <a-form-model-item label="icon图标" prop="icon">
            <a-upload
                    :customRequest="customImageRequest"
                    list-type="picture-card"
                    :showUploadList="false"
                    :before-upload="beforeUpload2"
            >
                <img v-if="icon" :src="icon"
                     style="width: 100px; height: 100px; margin-right: 0px;"
                />
                <div v-else>
                    <a-icon :type="loading2 ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                        Upload
                    </div>
                </div>
            </a-upload>
        </a-form-model-item>
        <a-form-model-item label="后台域名" prop="domainName">
            <a-input v-model="form.domainName" placeholder="域名 example.com"/>
        </a-form-model-item>
        <a-form-model-item label="后台显示名称" prop="displayName">
            <a-input v-model="form.displayName" placeholder="登陆页面，后台管理做上角显示名称"/>
        </a-form-model-item>
<!--      <a-form-model-item label="状态" prop="status">
        <a-radio-group v-model="form.status" :options="statusOptions"/>
      </a-form-model-item>-->
      <a-form-model-item label="状态" prop="status">
        <a-radio-group v-model="form.status" button-style="solid">
          <a-radio-button v-for="(d, index) in this.$store.getters.system_normal_disable" :key="index" :value="d.value" >{{ d.label }}</a-radio-button>
        </a-radio-group>
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
import {dataSource, metadataSource} from '@/services/index'

  export default {
    name: "ChannelEdit",
    data() {
      return {
        form: {},
        formTitle: '',
        confirmLoading: false,
        open: false,
          previewVisible1: false,
          loading1 : false,
          logo:'',

          previewVisible2: false,
          loading2 : false,
          icon:'',

          rules: {
          channelName: [{ required: true, message: '渠道名称不能为空', trigger: 'blur' }],
          channelCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
          channelSort: [{ required: true, message: '不能为空', trigger: 'blur' }],
          expireDate: [{ required: true, message: '不能为空', trigger: 'blur' }],
          status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
        }
      }
    },
    created() {
    },
    methods: {
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
          status:"1"
        }
      },
      /** 新增按钮操作 */
      handleAdd () {
        this.reset()
        this.open = true
        this.formTitle = '新增渠道'
      },
      /** 修改按钮操作 */
      handleUpdate (row, ids) {
        this.reset()
        const channelId = row ? row.channelId : ids[0]
        dataSource.channelDetail({"channelId":channelId}).then(data => {
          this.form = data
          this.form.expireDate = this.$moment(data.expireDate)
            this.logo=data.logo
            this.icon=data.icon
          this.open = true
          this.formTitle = '修改渠道'
        })
      },
      submitForm: function () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.confirmLoading = true
            if (this.form.channelId !== undefined) {
              dataSource.channelEdit({
                ...this.form,
                expireDate: this.$moment(this.form["expireDate"]).format("YYYY-MM-DD"),
              }).then(data => {
                this.$message.success('修改成功')
                this.open = false
                this.$emit('ok')
              }).finally(() => {
                this.confirmLoading = false
              })
            } else {
              dataSource.channelAdd({
                ...this.form,
                expireDate: this.$moment(this.form["expireDate"]).format("YYYY-MM-DD"),
              }).then(data => {
                this.$message.success('新增成功')
                this.open = false
                this.$emit('ok')
              }).finally(() => {
                this.confirmLoading = false
              })
            }
          } else {
            return false
          }
        })
      },
        beforeUpload1(file) {
            return new Promise(async (resolve, reject) => {
                console.info("beforeUpload:" + JSON.stringify(file))
                if (!file.type.includes('image')) {
                    this.$message.warning('请上传图片')
                    reject(new Error('请上传图片'))
                    return
                }
                file.ut = 'logo'
                resolve(file)
            })
        },
        beforeUpload2(file) {
            return new Promise(async (resolve, reject) => {
                console.info("beforeUpload:" + JSON.stringify(file))
                if (!file.type.includes('ico')) {
                    this.$message.warning('请上传ico图片')
                    reject(new Error('请上传ico图片'))
                    return
                }
                file.ut = 'icon'
                resolve(file)
            })
        },
        customImageRequest({action,file,onSuccess,onError,onProgress}) {
            console.info("上传图片file:" + JSON.stringify(file))
            // blob方式预览图片
            // 组装数据
            if (file.ut == 'logo'){
                this.logo = null;
                this.loading1 = true;
            } else {
                this.icon = null;
                this.loading2 = true;
            }
            const formData = new FormData()
            formData.append('file', file, file.fileName)
            metadataSource.uploadFile(formData).then(response => {
                if (file.ut == 'logo'){
                    this.form.logo = response.url
                    this.loading1 = false;
                    this.logo = window.URL.createObjectURL(file)
                    console.info("图片上传成功" + response.url + ",this.logo:" + this.logo)
                } else {
                    this.form.icon = response.url
                    this.loading2 = false;
                    this.icon = window.URL.createObjectURL(file)
                    console.info("图片上传成功" + response.url + ",this.icon:" + this.icon)
                }
                this.$message.success('上传成功')
            })
        },

    }
  }
</script>

<style lang="less" scoped>

</style>
