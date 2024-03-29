<template>
  <div>
    <a-space>
      <a-dropdown v-if="!sizeHide" :trigger="['click']">
        <a-button
            type="dashed"
            shape="circle"
            icon="column-height" />
        <a-menu slot="overlay" :selected-keys="[tableSize]" @click="changeSize">
          <a-menu-item key="default">
            {{$t('tableSizeNameDefault')}}
          </a-menu-item>
          <a-menu-item key="middle">
            {{$t('tableSizeNameMiddle')}}
          </a-menu-item>
          <a-menu-item key="small">
            {{$t('tableSizeNameSmall')}}
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-popover v-if="!settingHide" placement="bottomRight" trigger="click">
        <template slot="content">
          <a-tree
              class="draggable-tree"
              :show-icon="true"
              v-model="checkedKeys"
              checkable
              :replaceFields="replaceFields"
              draggable
              :tree-data="currentValue"
              @drop="onDrop"
          />
        </template>
        <template slot="title">
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
            {{$t('columnSort')}}
            <a-tooltip>
              <template slot="title">
                {{$t('columnDrag')}}
              </template>
              <a-icon type="question-circle" />
            </a-tooltip>
          </a-checkbox>
        </template>
        <a-button
            type="dashed"
            shape="circle"
            icon="setting" />
      </a-popover>
      <a-button
          type="dashed"
          shape="circle"
          v-if="!refreshHide"
          :loading="refreshLoading"
          icon="reload"
          @click="refresh" />
    </a-space>
  </div>
</template>

<script>
import Ellipsis from '@/components/ellipsis'
import {mapState} from "vuex";

export default {
  name: 'TableSetting',
  i18n: require('./i18n'),
  props: {
    tableSize: {
      type: String,
      default: 'default'
    },
    refreshLoading: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      required: true
    },
    refreshHide: {
      type: Boolean,
      default: false
    },
    settingHide: {
      type: Boolean,
      default: false
    },
    sizeHide: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Ellipsis
  },
  data () {
    return {
      allKey: [],
      indeterminate: true,
      checkAll: false,
      currentValue: [],
      checkedKeys: [],
      replaceFields: { children: 'children', title: 'currentTitle', key: 'dataIndex', slot: 'tsSlots' }
    }
  },
  computed: {
    ...mapState('setting', ['lang']),
  },
  mounted () {
    this.currentValue = this.value
    this.refreshColumn()
  },
  watch: {
    lang(val) {
      this.refreshColumn()
    },
    checkedKeys (cur, last) {
      const checked = cur.filter(function (v) { return last.indexOf(v) === -1 })
      const canceled = last.filter(function (v) { return cur.indexOf(v) === -1 })
      this.currentValue.forEach(column => {
        if (checked.length > 0) {
          if (checked.indexOf(column.dataIndex) > -1) {
            this.$set(column, 'width', column.width2)
            this.$set(column, 'ellipsis', column.ellipsis2)
            this.$set(column, 'hidden', false) //自定义处理隐藏列，a-table渲染的时候忽略
          }
        } else if (canceled.length > 0) {
          if (canceled.indexOf(column.dataIndex) > -1) {
            this.$set(column, 'width', 0)
            this.$set(column, 'ellipsis', true)
            this.$set(column, 'hidden', true)
          }
        }
      })
      this.indeterminate = !!cur.length && cur.length < this.allKey.length
      this.checkAll = cur.length === this.allKey.length
      this.$emit('input', this.currentValue)
    }
  },
  methods: {
    refreshColumn(){
      this.currentValue.forEach(column => {
        this.allKey.push(column.dataIndex)
        column.currentTitle = <ellipsis length={16} tooltip>{column.title}</ellipsis>
        if(column.width2 == null)
          column.width2 = column.width
        column.ellipsis2 = column.ellipsis
        if ((column.width !== 0 || !column.ellipsis) && !column.hidden) {
          this.checkedKeys.push(column.dataIndex)
        } else {
          //not check
          this.$set(column, 'width', 0)
          this.$set(column, 'ellipsis', true)
        }
        column.switcherIcon = <a-icon type="pic-left" />
      })
    },
    changeSize (e) {
      this.$emit('update:tableSize', e.key)
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        checkedKeys: e.target.checked ? this.allKey : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    refresh () {
      this.$emit('refresh')
    },
    onDrop (info) {
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.dataIndex === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.value]

      // Find dragObject
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      let ar
      let i
      loop(data, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
      this.$emit('input', data)
      this.currentValue = data
    }
  }
}
</script>
