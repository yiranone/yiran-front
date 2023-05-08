<template>
  <a-modal :visible="open"
           :title="formTitle"
           :width="1000"
           :destroyOnClose="true"
           :confirmLoading="confirmLoading"
           @cancel="open = false"
           @ok="submitForm">
<!--    <svg-icon style="width: 30px;height: 30px;" slot="closeIcon" icon-name="close"/>-->
    <a-form-model ref="form" :model="form" :rules="rules" :hideRequiredMark="true" :label-col="{span:5}" :wrapper-col="{span:16}">
      <a-form-item label="上级目录"
                   prop="parentId">
        <a-tree-select
            v-model="form.parentId"
            :tree-data="treeData"
            placeholder="请选择上级目录"
            :replaceFields="replaceFields"
            :treeExpandedKeys.sync="treeExpandedKeys"
            allowClear/>
      </a-form-item>
          <a-form-model-item label="菜单类型" prop="menuType">
            <a-radio-group v-model="form.menuType" :options="menuTypes"/>
          </a-form-model-item>
          <a-form-model-item prop="isFrame" v-if="form.menuType == 'C'">
            <span slot="label">
              是否外链
              <a-tooltip>
                <template slot="title">
                  选择是外链则路由地址需要以`http(s)://`开头
                </template>
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-radio-group v-model="form.isFrame" button-style="solid">
              <a-radio-button value="1">是</a-radio-button>
              <a-radio-button value="2">否</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item class="perms"
                             :label="form.isFrame == '1'? '链接地址':'路由地址' "
                             v-if="form.menuType=='M' || form.menuType=='C'"
                             prop="router" >
            <a-input v-model="form.router"
                     :placeholder="form.isFrame == '1'? '例子 https://wbaidu.com':'例子 user or ext/member'  "
                     allowClear/>
          </a-form-model-item>
          <a-form-model-item label="参数"
                             v-if="form.menuType=='C' && form.isFrame != '1'"
                             prop="query" >
            <a-input v-model="form.query"
                     placeholder="例子 name=zhangsan&id=8 "
                     allowClear/>
          </a-form-model-item>
          <a-form-model-item label="名称"
                             v-if="form.menuType=='M' || form.menuType=='C' || form.menuType=='F'"
                             prop="menuName">
            <a-input v-model="form.menuName"
                     placeholder="菜单名称"
                     allowClear/>
          </a-form-model-item>
          <a-form-model-item label="组件" v-if="form.menuType=='C' && form.isFrame != '1'" prop="component">
            <a-input v-model="form.component"
                     placeholder="例子 /page/system/menu"
                     allowClear/>
          </a-form-model-item>
      <a-form-model-item v-if="form.menuType=='M' || form.menuType=='C'"
                         label="图标"
                         prop="menuIcon">
        <div style="position: relative">
          <a-input v-model="form.icon"
                   placeholder="请选择目录图标"
                   @input="handleIconInput"
                   @focus="iconVisible = true"
                   @blur="handleBlur"
                   allowClear>
            <a-icon slot="prefix" :type="form.icon == null ? ' ' : form.icon "/>
          </a-input>
          <transition name="fade-icon">
            <div v-show="iconVisible" class="icon-select">
              <a-card :bordered="false">
                <a-card-grid v-for="(item, index) in iconList" :key="`icon_${index}`"
                             style="width:20%;text-align:center;box-shadow: none;" :bordered="false">
                  <div class="icon-item" @click.stop="handleIconSelect(item)">
                    <a-icon :type="item" :style="{fontSize:'16px'}"/>
                    <p>{{ item }}</p>
                  </div>
                </a-card-grid>
              </a-card>
            </div>
          </transition>
        </div>
      </a-form-model-item>
      <a-form-model-item class="radio"
                         label="显示排序"
                         prop="orderNum">
        <a-input-number v-model="form.orderNum"
                        placeholder="数字，小的在前面"
                        :min="1"/>
      </a-form-model-item>
      <a-form-model-item v-if="form.menuType!='M' "
                         label="权限标识"
                         prop="perms">
        <a-input v-model="form.perms"
                 placeholder="例子 system:user:view"
                 allowClear/>
      </a-form-model-item>
<!--      <a-form-model-item prop="isCache" v-if="form.menuType == 'C' && form.isFrame != '1'">
        <span slot="label">
          是否缓存
          <a-tooltip>
            <template slot="title">
              选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致，仅在多页签下有效。
            </template>
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-radio-group v-model="form.isCache" button-style="solid">
          <a-radio-button v-for="(d, index) in cacheOptions" :key="index" :value="d.value" >{{ d.label }}</a-radio-button>
        </a-radio-group>
      </a-form-model-item>-->
      <a-form-model-item label="显示状态" prop="visible">
        <a-radio-group v-model="form.visible" button-style="solid">
          <a-radio-button v-for="(d, index) in visibleStations" :key="index" :value="d.value" >{{ d.label }}</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import iconData from './iconsData'
import {filterArray} from '@/utils/util'
import {dataSource} from '@/services'

let selectIconTimer = null;
export default {
  props: {
    allMenus: [],
  },
  data() {
    return {
      form: {},
      formTitle: '',
      confirmLoading: false,
      open: false,
      replaceFields: {
        key: 'menuId',
        value: 'menuId',
        title: 'menuName'
      },
      menuTypes: [
        {label: '目录', value: 'M'},
        {label: '菜单', value: 'C'},
        {label: '按钮', value: 'F'},
      ],
      linkOptions: [
        {label: '是', value: true},
        {label: '否', value: false},
      ],
      // cacheOptions: [
      //   {label: '是', value: "1"},
      //   {label: '否', value: "2"},
      // ],
      visibleStations : this.$store.getters.system_visible_status,
      iconVisible: false,
      iconList: iconData,
      treeExpandedKeys: [0],
      rules: {
        parentId: [{required: true, message: '请选择目录', trigger: 'change'}],
        icon: [{required: true, message: '请选择目录图标', trigger: 'change'}],
        menuType: [{required: true, message: '请选择菜单类型', trigger: 'change'}],
        menuName: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
        orderNum: [{required: true, message: '请设置显示排序', trigger: 'blur'}],
        router: [{required: true, message: '请输入路由标识', trigger: 'blur'}],
        visible: [{required: true, message: '请选择显示状态', trigger: 'change'}],
        status: [{required: true, message: `状态`, trigger: 'change'}],
        isLink: [{required: true, message: '请选择外链状态', trigger: 'change'}],
        url: [{required: true, message: '请输入链接地址', trigger: 'blur'}],
      }
    }
  },

  watch: {
    // formInfo(val) {
    //   if (JSON.stringify(val) != "{}") {
    //     this.form = {...val}
    //     this.treeExpandedKeys = [this.form.parentId]
    //   }
    // }
  },

  computed: {
    treeData() {
      return [
        {
          menuId: 0,
          parentId: 0,
          menuName: '根目录',
          children: this.allMenus
        },
      ]
    }
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
        visible : "1",
        isFrame : "2",
        isCache : "1",
        menuType : "M"
      }
    },
    handleAdd (record) {
      this.reset()
      if(record != null) {
        this.form.parentId = record.menuId
      }
      this.open = true
      this.formTitle = '新增菜单'
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      dataSource.menuDetail({"menuId":row.menuId}).then(data =>{
        this.form = row
        this.open = true
        this.formTitle = '修改菜单'
      })
    },

    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          if (this.form.menuId !== undefined) {
            dataSource.menuEdit(this.form).then(data => {
              this.$message.success('修改成功')
              this.open = false
              this.$emit('ok')
            }).finally(() => {
              this.confirmLoading = false
            })
          } else {
            dataSource.menuAdd(this.form).then(data => {
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
