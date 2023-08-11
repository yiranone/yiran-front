<template>
  <page-layout title=" ">
    <div slot="headerContent">
    </div>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :xxl="5" :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="公告标题">
                <a-input v-model="queryParam.noticeTitle" placeholder="请输入" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :xxl="5" :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="公告类型">
                <a-select placeholder="请选择" v-model="queryParam.noticeType" style="width: 100%" allow-clear>
                  <a-select-option v-for="(d, index) in typeOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :xxl="5" :xl="6" :lg="8" :md="12" :sm="24">
                <a-form-item label="公告状态">
                  <a-select placeholder="请选择" v-model="queryParam.status" style="width: 100%" allow-clear>
                    <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xxl="8" :xl="10" :lg="14" :md="24" :sm="24">
                <a-form-item label="创建时间">
                  <a-range-picker style="width: 100%" v-model="queryParam.dateRange"
                                  :placeholder="['开始时间','结束时间']" :ranges='timeRange'
                                  valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" allow-clear/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :xxl="5" :xl="6" :lg="8" :md="12" :sm="24" style="float: right">
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
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPerm="['system:notice:add']">
          <a-icon type="plus" />新增
        </a-button>
        <a-button type="primary" :disabled="!isSelectedSingle" @click="$refs.createForm.handleUpdate(undefined, selectedRowKeys)" v-hasPerm="['system:notice:edit']">
          <a-icon type="edit" />修改
        </a-button>
        <a-button type="danger" :disabled="!isSelected" @click="handleDelete" v-hasPerm="['system:notice:delete']">
          <a-icon type="delete" />删除
        </a-button>
        <a-button type="primary" @click="handleExport" v-hasPerm="['system:notice:export']">
          <a-icon type="download" />导出
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
          rowKey="noticeId"
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
        <template slot="status" slot-scope="{text}">
          <span v-html="statusStr(text)"></span>
        </template>
        <template slot="type" slot-scope="{text}">
          <span v-html="typeStr(text)"></span>
        </template>
        <template slot="operation" slot-scope="{text, record}">
          <a @click="$refs.createForm.handleUpdate(record, undefined)" v-hasPerm="['system:notice:edit']">
            <a-icon type="edit" /> 修改
          </a>
        </template>
      </standard-table>
      <!-- 增加修改 -->
      <create-form
          ref="createForm"
          :typeOptions="typeOptions"
          :statusOptions="statusOptions"
          @ok="getList"
      />
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import { tableMixin } from '@/store/table-mixin'

import {dataSource} from '@/services/index'
import CreateForm from './modules/CreateForm'

export default {
  name: 'Config',
  components: {
    CreateForm,StandardTable,PageLayout
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      total: 0,
      loading: false,
      refreshing: false,
      // 状态数据字典
      typeOptions: [],
      statusOptions: [],
      // 日期范围
      dateRange: [],
      columns: [
        {
          title: '公告ID',
          dataIndex: 'noticeId',
          align: 'center',
          sorter: true
        },
        {
          title: '公告标题',
          dataIndex: 'noticeTitle',
          sorter: true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '公告类型',
          dataIndex: 'noticeType',
          scopedSlots: { customRender: 'type' },
          sorter: true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '公告状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          sorter: true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '15%',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ]
    }
  },
  filters: {
  },
  created () {
    this.getList()
    this.typeOptions = this.$store.getters.system_notice_type
    this.statusOptions = this.$store.getters.system_normal_disable
  },
  computed: {
  },
  watch: {
  },
  methods: {
    statusStr(val) {
      return this.selectDictLabel(this.$store.getters.system_normal_disable, val)
    },
    typeStr(val) {
      return this.selectDictLabel(this.$store.getters.system_notice_type, val)
    },
    /** 查询参数列表 */
    getList () {
      this.loading = true
      this.addDateRange(this.queryParam,this.queryParam.dateRange,"create")
      dataSource.noticeList(this.queryParam).then(data => {
          this.list = data.rows
          this.total = data.count
          this.loading = false
        }
      )
    },
    // 参数系统内置字典翻译
    typeFormat (row) {
      return this.selectDictLabel(this.typeOptions, row.noticeType)
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      var that = this
      const configIds = row.noticeId ?  [row.noticeId] : this.selectedRowKeys
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + configIds + '的数据',
        onOk () {
          return dataSource.noticeRemove({configIds:configIds})
            .then(() => {
              that.onSelectChange([], [])
              that.getList()
              that.$message.success('删除成功')
          })
        },
        onCancel () {}
      })
    },
    /** 导出按钮操作 */
    handleExport () {
      var that = this
      this.$confirm({
        title: '是否确认导出?',
        content: '此操作将导出当前条件下所有数据而非选中数据',
        onOk () {
          that.download('system/notice/export', {
            ...that.queryParam
          }, `notice_${new Date().getTime()}.xlsx`)
        },
        onCancel () {}
      })
    },

  }
}
</script>
