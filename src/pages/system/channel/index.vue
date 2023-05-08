<template>
  <page-layout title="" showPageTitle="false">
    <a-card>
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="渠道名称">
                <a-input v-model="queryParam.searchChannelName" placeholder="" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="渠道编码">
                <a-input v-model="queryParam.searchChannelCode" placeholder="" allow-clear/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select placeholder="请选择" v-model="queryParam.searchStatus" style="width: 100%" allow-clear>
                    <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="到期时间大于">
                  <a-date-picker v-model="queryParam.searchExpireDate1" style="width: 100%" placeholder="" />
                </a-form-item>
              </a-col>
              <a-col :xl="8" :sm="24">
                <a-form-item label="到期时间小于">
                  <a-date-picker v-model="queryParam.searchExpireDate2" style="width: 100%" placeholder="" />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作 -->
      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPerm="['system:channel:add']">
          <a-icon type="plus" />新增
        </a-button>
        <a-button type="danger" :disabled="!isSelected" @click="handleDelete" v-hasPerm="['system:channel:delete']">
          <a-icon type="delete" />删除
        </a-button>
        <a-dropdown v-hasPerm="['system:channel:add','system:channel:delete']">
          <a-menu slot="overlay">
            <a-menu-item v-hasPerm="['system:channel:add']" @click="$refs.createForm.handleAdd()">新增</a-menu-item>
            <a-menu-item v-hasPerm="['system:channel:delete']" @click="handleDelete">删除</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
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
          rowKey="channelId"
          :loading="loading"
          :total="total"
          :showSelectInfo='false'
          :showRowSelection='true'
          :selectedRowKeys='selectedRowKeys'
          :selectedRows='selectedRows'
          :pageNum="pageNum"
          :pageSize="pageSize"
          :pageSizeOptions="pageSizeOptions"
          :sortChange="onSortChange"
          :selectedRowChange="onSelectChange"
          :pageSizeChange="onPageSizeChange"
          :pageNumChange="onPageNumChange"
      >
        <template slot="status" slot-scope="{text,record}">
          <span v-html="statusStr(text,record)"></span>
        </template>
        <template slot="action" slot-scope="{text, record}">
          <a class="action-editor" v-hasPerm="['system:channel:edit']" style="margin-right: 8px"
             @click="$refs.createForm.handleUpdate(record)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a class="action-delete" style="margin-right: 8px;" v-hasPerm="`system:channel:delete`" @click="handleDelete(record)">
            <a-icon type="delete"/>
            删除
          </a>
          <a-dropdown v-hasPerm="['system:channel:edit','system:channel:delete']">
            <a-menu slot="overlay">
              <a-menu-item v-hasPerm="['system:channel:edit']">
                <a class="action-editor"
                   @click="$refs.createForm.handleUpdate(record)">
                  <a-icon type="edit"/>编辑
                </a>
              </a-menu-item>
              <a-menu-item v-hasPerm="`system:channel:delete`">
                <a class="action-delete" style="margin-right: 8px;" @click="handleDelete(record)">
                  <a-icon type="delete"/>删除
                </a>
              </a-menu-item>
            </a-menu>
            <a class="" style="white-space: nowrap">
              更多操作 <a-icon type="down" />
            </a>
          </a-dropdown>
        </template>
      </standard-table>
      <ChannelEdit ref="createForm" @ok="getList"/>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import { tableMixin } from '@/store/table-mixin'

import ChannelEdit from './channel-form'
import {dataSource} from '@/services/index'

const columns = [
  {
    title: '渠道ID',
    dataIndex: 'channelId',
    sorter: true,
    align: 'left',
    width: 100
  }, {
    title: '渠道名称',
    dataIndex: 'channelName',
    sorter: true,
    width: 100
  }, {
    title: '渠道编码',
    dataIndex: 'channelCode',
    width: 120
  }, {
    title: '到期时间',
    dataIndex: 'expireDate',
    align: 'left',
    sorter: true,
    width: 100,
  },{
    title: '排序',
    dataIndex: 'channelSort',
    align: 'center',
    sorter: true,
    width: 65
  }, {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    sorter: true,
    width: 65,
    scopedSlots: {customRender: 'status'}
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    sorter: true,
    width: 180
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    align: 'center',
    sorter: true,
    width: 180
  }, {
    title: '创建人',
    dataIndex: 'createBy',
    align: 'center',
    width: 80
  }, {
    title: '修改人',
    dataIndex: 'updateBy',
    align: 'center',
    width: 80
  }, {
    title: '操作',
    dataIndex: 'operater',
    scopedSlots: {customRender: 'action'},
    align: 'center',
    width: 200
  }
]

export default {
  components: {PageLayout, StandardTable, ChannelEdit},
  mixins: [tableMixin],
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      statusOptions: [],
      columns: columns,
    }
  },

  provide() {
    return {
      parent: this
    }
  },

  created() {
    this.statusOptions=this.$store.getters.system_normal_disable
    this.getList()
  },

  methods: {
    statusStr(val) {
      return this.selectDictLabel(this.statusOptions, val)
    },
    /*获取数据列表*/
    getList() {
      this.loading = true
      const s = {}
      s["searchExpireDate1"] = this.queryParam["searchExpireDate1"] != null ? this.$moment(this.queryParam["searchExpireDate1"]).format("YYYY-MM-DD") : '',
      s["searchExpireDate2"] = this.queryParam["searchExpireDate2"] != null ?  this.$moment(this.queryParam["searchExpireDate2"]).format("YYYY-MM-DD"): '',
      dataSource.channelList({...this.queryParam,...s}).then(res => {
        const {rows, count} = res
        this.list = rows
        this.total = count
        this.loading = false
      }).catch(res => {
        this.loading = false
      })
    },

    /** 删除按钮操作 */
    handleDelete (row) {
      var that = this
      const selectedIds = row.channelId ?  [row.channelId] : this.selectedRowKeys
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + selectedIds + '的数据',
        onOk () {
          return dataSource.channelRemove({channelIds:selectedIds})
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

