<template>
  <page-layout title=" ">
    <div slot="headerContent">
    </div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单名称">
                <a-input v-model="queryParam.menuName" placeholder="请输入菜单名称" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" style="float:right">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPerm="['system:menu:add']">
          <a-icon type="plus" />新增
        </a-button>
        <table-setting
            :style="{float: 'right'}"
            :table-size.sync="tableSize"
            v-model="columns"
            :refresh-loading="loading"
            @refresh="getList" />
      </div>
      <standard-table
          :columns="columns"
          :dataSource="list"
          :size="tableSize"
          rowKey="menuId"
          :loading="loading"
          :total="total"
          :showSelectInfo='false'
          :showRowSelection='false'
          :showPageButtons='false'
          :sortChange="onSortChange"
          :defaultExpandedRowKeys="[2]"
      >
        <template slot="icon" slot-scope="{text}">
          <a-icon :type="text == null ? ' ' : text "/>
        </template>
        <template slot="visible" slot-scope="{text,record}">
          <span v-html="visibleFormat(text,record)"></span>
        </template>
        <template slot="action" slot-scope="{text, record}">
          <a style="margin-right: 8px" @click="$refs.createForm.handleAdd(record)">
            <a-icon type="plus"/>
            新增
          </a>
          <a class="action-editor" style="margin-right: 8px" @click="$refs.createForm.handleUpdate(record)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a @click="handleDelete(record)" v-hasPerm="['system:menu:delete']">
            <a-icon type="delete" />删除
          </a>
        </template>
      </standard-table>
      <CreateForm  ref="createForm" :allMenus="list" @ok="getList"/>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import {tableMixin} from "@/store/table-mixin";

import CreateForm from './menu-form'
import {dataSource} from '@/services/index'
import {handleTree} from "@/utils/util";

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    width: 220
  }, {
    title: '图标',
    dataIndex: 'icon',
    align: 'center',
    scopedSlots: {customRender: 'icon'},
    width: 100
  }, {
    title: '排序',
    dataIndex: 'orderNum',
    align: 'center',
    width: 100
  }, {
    title: '路由标识',
    dataIndex: 'router',
    align: 'left',
    width: 120
  }, {
    title: '类型',
    dataIndex: 'menuType',
    align: 'left',
    width: 60
  }, {
    title: '权限字符',
    dataIndex: 'perms',
    align: 'left',
    width: 200
  }, {
    title: '是否显示',
    dataIndex: 'visible',
    scopedSlots: {customRender: 'visible'},
    align: 'center',
    width: 200
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    hidden:true,
    align: 'center',
    width: 200,
  }, {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'action'},
    align: 'right',
    width: 200
  }
]

export default {
  components: {PageLayout, StandardTable, CreateForm},
  mixins: [tableMixin],
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      columns: columns,
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.loading = true
      dataSource.menuList({...this.queryParam, pageSize:10000}).then(res => {
        this.list = handleTree(res, "menuId")
        this.loading = false
      })
    },
    visibleFormat (text, row) {
      return this.selectDictLabel(this.$store.getters.system_visible_status, text)
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      var that = this
      const selectedIds = row.menuId ?  [row.menuId] : this.selectedRowKeys
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + selectedIds + '的数据',
        onOk () {
          return dataSource.menuDelete({menuIds:selectedIds})
              .then(() => {
                that.onSelectChange([], [])
                that.getList()
                that.$message.success('删除成功')
              })
        },
        onCancel () {}
      })
    },
  }
}
</script>

<style lang="less" scoped>

</style>
