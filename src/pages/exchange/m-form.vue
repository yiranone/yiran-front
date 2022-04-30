<template>
  <a-modal :visible="parent.formVisible"
           :title="title"
           :width="650"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="parent.formVisible = false"
           @ok="handleOk"
           :afterClose="afterClose">
    <svg-icon style="width: 30px;height: 30px;" slot="closeIcon" icon-name="close"/>
    <a-form-model ref="form" :model="form" :rules="rules" :hideRequiredMark="true">
      <a-form-item label="上级目录"
                   prop="parentId"
                   :labelCol="{sm: {span: 3}}"
                   :wrapperCol="{sm: {span: 20}}">
        <a-tree-select
            v-model="form.parentId"
            :tree-data="treeData"
            placeholder="请选择上级目录"
            :replaceFields="replaceFields"
            :treeExpandedKeys.sync="treeExpandedKeys"
            allowClear/>
      </a-form-item>
      <a-row type="flex" justify="space-between">
        <a-col :sm="{span: 12}" :xs="24">
          <a-form-model-item label="菜单名称"
                             prop="menuName"
                             :labelCol="{sm: {span: 6}}"
                             :wrapperCol="{sm: {span: 16}}">
            <a-input v-model="form.menuName"
                     placeholder="菜单名称"
                     allowClear/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="{span: 12}" :xs="24">
          <a-form-model-item class="radio"
                             label="显示排序"
                             prop="orderNum"
                             :labelCol="{sm: {span: 6}}"
                             :wrapperCol="{sm: {span: 16}}">
            <a-input-number v-model="form.orderNum"
                            placeholder="请设置显示排序"
                            :min="1"/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="{span: 12}" :xs="24">
          <a-form-model-item class="perms"
                             label="权限标识"
                             prop="perms"
                             :labelCol="{sm: {span: 6}}"
                             :wrapperCol="{sm: {span: 16}}">
            <a-input v-model="form.perms"
                     placeholder="请输入权限标识"
                     allowClear/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="{span: 12}" :xs="24">
          <a-form-model-item class="perms"
                             label="路由标识"
                             prop="router"
                             :labelCol="{sm: {span: 6}}"
                             :wrapperCol="{sm: {span: 16}}">
            <a-input v-model="form.router"
                     placeholder="请输入路由标识"
                     allowClear/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="{span: 12}" :xs="24">
          <a-form-model-item label="显示状态"
                             prop="visible"
                             :labelCol="{sm: {span: 6}}"
                             :wrapperCol="{sm: {span: 16}}">
            <a-radio-group v-model="form.visible" :options="visibleOptions"/>
          </a-form-model-item>
        </a-col>
        <a-col :sm="{span: 12}" :xs="24">
          <a-form-model-item label="是否外链"
                             prop="isLink"
                             :labelCol="{sm: {span: 6}}"
                             :wrapperCol="{sm: {span: 16}}">
            <a-radio-group v-model="form.isLink" :options="linkOptions"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-form-model-item v-show="form.isLink"
                         label="链接地址"
                         prop="url"
                         :labelCol="{sm: {span: 3}}"
                         :wrapperCol="{sm: {span: 20}}">
        <a-input v-model="form.url"
                 placeholder="请输入链接地址"
                 allowClear/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
  import {filterArray} from '@/utils/util'
  import {userService as us} from '@/services'

  let selectIconTimer = null;
  export default {
    name: "m-form",
    inject: ['parent'],
    data() {
      return {
        replaceFields: {
          key: 'menuId',
          value: 'menuId',
          title: 'menuName'
        },
        linkOptions: [
          {label: '是', value: true},
          {label: '否', value: false},
        ],
        visibleOptions: [
          {label: '显示', value: '0'},
          {label: '隐藏', value: '1'},
        ],
        statusOptions: [
          {label: '正常', value: '0'},
          {label: '停用', value: '1'},
        ],
        iconVisible: false,
        confirmLoading: false,
        treeExpandedKeys: [0],
        form: {
          parentId: undefined,
          menuIcon: '',
          menuName: '',
          orderNum: '',
          perms: '',
          router: '',
          visible: '',
          status: '',
          isLink: '',
          url: ''
        },
        rules: {
          parentId: [{required: true, message: '请选择目录', trigger: 'change'}],
          icon: [{required: true, message: '请选择目录图标', trigger: 'change'}],
          menuName: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
          orderNum: [{required: true, message: '请设置显示排序', trigger: 'blur'}],
          perms: [{required: true, message: '请输入权限标识', trigger: 'blur'}],
          router: [{required: true, message: '请输入路由标识', trigger: 'blur'}],
          visible: [{required: true, message: '请选择显示状态', trigger: 'change'}],
          status: [{required: true, message: `状态`, trigger: 'change'}],
          isLink: [{required: true, message: '请选择外链状态', trigger: 'change'}],
          url: [{required: true, message: '请输入链接地址', trigger: 'blur'}],
        }
      }
    },

    watch: {
      formInfo(val) {
        if (JSON.stringify(val) != "{}") {
          this.form = {...val}
          this.treeExpandedKeys = [this.form.parentId]
        }
      }
    },

    props: {
      formInfo: Object
    },

    computed: {
      title() {
        return `${this.parent.formType}菜单`
      },
      treeData() {
        return [
          {
            menuId: 0,
            parentId: 0,
            menuName: '根目录',
            children: this.parent.dataSource
          },
        ]
      }
    },

    methods: {
      afterClose() {
        this.form = {
          parentId: undefined,
          icon: '',
          menuName: '',
          orderNum: '',
          perms: '',
          router: '',
          visible: '',
          status: '',
          isLink: '',
          url: ''
        }
        this.parent.formType = ''
        this.parent.menuInfo = {}
      },

      async handleOk() {
        let props = ['parentId', 'menuName', 'orderNum', 'perms', 'router', 'visible', 'isLink'], errors = [];
        if (this.form.parentId == 0) props = [...props, 'icon'];
        if (this.form.isLink) props = [...props, 'url'];
        this.$refs.form.validateField(props, errorMessage => {
          errorMessage && errors.push(errorMessage)
        });
        let conditions = {}
        if (errors.length == 0) {
          props.forEach(item => {
            conditions[item] = this.form[item]
          })
          this.confirmLoading = true
          await us.menuAddOrEditor({
            ...conditions,
            menuId: this.formInfo.menuId
          }, this.parent.formType)
              .then(res => {
                this.$message.success(`${this.parent.formType == '新增' ? '添加' : '修改'}成功`)
                this.$emit('success')
                this.confirmLoading = false
                this.parent.formVisible = false
              }).catch(() => {})
          this.confirmLoading = false
        }
      },

      /*icon输入匹配图标*/
      handleIconInput() {
        if (selectIconTimer) clearTimeout(selectIconTimer)
        selectIconTimer = setTimeout(() => {
          this.iconList = filterArray(iconData, this.form.menuIcon)
        }, 300)
      },

      /*icon输入框失去焦点*/
      handleBlur() {
        setTimeout(() => {
          this.iconVisible = false
        }, 200)
      },

      /*选择icon*/
      handleIconSelect(icon) {
        this.form.icon = icon
        this.$refs.form.clearValidate('icon')
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .ant-input-number {
    width: 100%;
  }

  .icon-select {
    width: 100%;
    height: 200px;
    background: #ffffff;
    overflow-y: scroll;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    position: absolute;
    top: 43px;
    left: 0;
    z-index: 10;

    /deep/ .ant-card-grid {
      padding: 5px;

      p {
        margin-bottom: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .icon-item:hover {
      cursor: pointer;
      color: @primary-color
    }

    .icon {
      padding: 5px 10px;
    }
  }

  .fade-icon-enter, fade-icon-leave-to {
    height: 0;
  }

  .fade-icon-enter-to, fade-icon-leave {
    height: 200px;
  }

  .fade-icon-enter-active, fade-icon-leave-active {
    transition: all 0.3s;
  }

</style>
