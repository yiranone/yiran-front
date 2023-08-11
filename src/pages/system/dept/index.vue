<template>
  <page-layout title=" ">
    <div slot="headerContent">
    </div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="部门名称">
                <a-input v-model="queryParam.deptName" placeholder="" allow-clear/>
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
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPerm="['system:dept:add']">
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
            rowKey="deptId"
            :loading="loading"
            :total="total"
            :showSelectInfo='false'
            :showRowSelection='false'
            :showPageButtons='false'
            :sortChange="onSortChange"
            :defaultExpandedRowKeys="[1]"
        >
          <template slot="status" slot-scope="{text}">
            <span v-html="statusStr(text)"></span>
          </template>
          <template slot="action" slot-scope="{text, record}">
            <a style="margin-right: 8px" @click="$refs.createForm.handleAdd(record)" v-hasPerm="['system:dept:add']">
              <a-icon type="plus"/>新增
            </a>
            <a class="action-editor" style="margin-right: 8px" @click="$refs.createForm.handleUpdate(record)"  v-hasPerm="['system:dept:edit']">
              <a-icon type="edit"/>编辑
            </a>
            <a @click="handleDelete(record)" v-hasPerm="['system:dept:delete']">
              <a-icon type="delete"/>删除
            </a>
          </template>
        </standard-table>
      <CreateForm ref="createForm" :all-depts="list" @ok="getList"/>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import { tableMixin } from '@/store/table-mixin'

import CreateForm from './dept-form'
import {dataSource, dataSource as ds} from '@/services/index'
import {handleTree} from "@/utils/util";

const columns = [
  {
    title: '部门名称',
    dataIndex: 'deptName',
    width: 220
  },{
    title: '部门编码',
    dataIndex: 'deptCode',
    width: 220
  }, {
    title: '排序',
    dataIndex: 'orderNum',
    sorter: false,
    align: 'center',
    width: 100
  },{
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    sorter: true,
    ellipsis: true,
    align: 'center'
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
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
    statusStr(val) {
      return this.selectDictLabel(this.$store.getters.system_normal_disable, val)
    },
    getList() {
      this.loading = true
      ds.deptList({...this.queryParam, pageSize:10000}).then(res => {
        this.list = handleTree(res, "deptId")
        this.loading = false
      })
    },

    /** 删除按钮操作 */
    handleDelete (row) {
      var that = this
      const selectedIds = row.deptId ?  [row.deptId] : this.selectedRowKeys
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + selectedIds + '的数据',
        onOk () {
          return dataSource.deptRemove({deptIds:selectedIds})
              .then(() => {
                that.onSelectChange([], [])
                that.getList()
                that.$message.success('删除成功')
              })
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
