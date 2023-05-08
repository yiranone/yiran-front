<template>
  <page-layout title=" ">
    <div slot="headerContent">
    </div>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="登录账户">
                <a-input v-model="queryParam.loginName" placeholder="请输入登录账户" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="部门">
                <a-input v-model="queryParam.deptName" placeholder="" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作 -->
      <div class="table-operations">
        <table-setting
          :style="{float: 'right'}"
          :table-size.sync="tableSize"
          v-model="columns"
          :refresh-loading="loading"
          @refresh="getList" />
      </div>
      <!-- 数据展示 -->
      <standard-table
          :columns="columns"
          :dataSource="list"
          :size="tableSize"
          rowKey="sessionId"
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
          :hideOnSinglePage='false'
      >
        <template slot="status" slot-scope="{text}">
<!--  <div v-html="statusStr(text)"></div>  {{statusStr(text)}}-->
          <span v-html="statusStr(text)"></span>
        </template>
        <template slot="action" slot-scope="{text, record}">
          <a-popconfirm
              ok-text="是"
              cancel-text="否"
              @confirm="confirmHandleForceLogout(record)"
              @cancel="cancelHandleForceLogout(record)"
          >
            <span slot="title">确认强退<b>{{ record.userName }}</b>的用户吗?</span>
            <a v-hasPerm="['system:online:forceLogout']"> 强退 </a>
          </a-popconfirm>
        </template>
      </standard-table>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import { tableMixin } from '@/store/table-mixin'

import {dataSource} from '@/services/index'

export default {
  name: 'Online',
  components: {
    PageLayout,StandardTable
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      loading: false,
      total: 0,
      columns: [
        {
          title: '会话编号',
          dataIndex: 'sessionId',
          ellipsis: true,
          hidden: true,
          align: 'center',
          width: 380
        },
        {
          title: '用户',
          dataIndex: 'loginName',
          sorter: true,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '部门',
          dataIndex: 'deptName',
          sorter: true,
          align: 'center'
        },
        {
          title: '渠道',
          dataIndex: 'channelName',
          sorter: true,
          align: 'center'
        },
        {
          title: '登录IP',
          dataIndex: 'ipAddr',
          sorter: true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '登录地点',
          dataIndex: 'loginLocation',
          sorter: true,
          align: 'center'
        },
        {
          title: '浏览器',
          sorter: true,
          dataIndex: 'browser',
          align: 'center'
        },
        {
          title: '操作系统',
          dataIndex: 'os',
          sorter: true,
          hidden : true,
          align: 'center'
        },
        {
          title: '是否在线',
          dataIndex: 'status',
          sorter: true,
          scopedSlots: {customRender: 'status'},
          align: 'center'
        },
        {
          title: '登录时间',
          dataIndex: 'startTimestamp',
          sorter: true,
          width: 180,
          align: 'center'
        },
        {
          title: '最近访问时间',
          dataIndex: 'lastAccessTime',
          sorter: true,
          width: 180,
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {customRender: 'action'},
          align: 'center'
        }
      ]
    }
  },
  filters: {
  },
  created () {
    this.getList()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    statusStr(val) {
      return this.selectDictLabel(this.$store.getters.system_online_offline, val)
    },
    /** 查询登录日志列表 */
    getList () {
      this.loading = true
      dataSource.onlineList(this.queryParam).then(data => {
            this.list = data.rows
            this.total = data.count
            this.loading = false
          }
      )
    },

    /** 强退按钮操作 */
    confirmHandleForceLogout (row) {
      dataSource.onlineLogout({sessionId:row.sessionId})
      .then(() => {
        this.getList()
        this.$message.success('已强制用户退出')
      }).catch(function () {
        this.$message.error('发生异常')
      })
    },
    cancelHandleForceLogout (row) {
    }
  }
}
</script>
