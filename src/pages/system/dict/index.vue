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
              <a-form-item label="字典名称">
                <a-input v-model="queryParam.dictName" placeholder="请输入字典名称" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="字典类型">
                <a-input v-model="queryParam.dictType" placeholder="请选择字典类型" allow-clear/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select placeholder="字典状态" v-model="queryParam.status" style="width: 100%">
                    <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间">
                  <a-range-picker style="width: 100%" v-model="dateRange"
                                  :placeholder="['开始时间','结束时间']" :ranges='timeRange'
                                  valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" />
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
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPerm="['system:dict:add']">
          <a-icon type="plus" />新增
        </a-button>
        <a-button type="primary" :disabled="!isSelectedSingle" @click="$refs.createForm.handleUpdate(undefined, selectedRowKeys)" v-hasPerm="['system:dict:edit']">
          <a-icon type="edit" />修改
        </a-button>
        <a-button type="danger" :disabled="!isSelected" @click="handleDelete" v-hasPerm="['system:dict:delete']">
          <a-icon type="delete" />删除
        </a-button>
        <a-button type="primary" @click="handleExport" v-hasPerm="['system:dict:export']">
          <a-icon type="download" />导出
        </a-button>
<!--        <a-button type="dashed" :loading="refreshing" @click="handleRefreshCache" v-hasPerm="['system:dict:remove']">
          <a-icon type="redo" />刷新缓存
        </a-button>-->
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
          rowKey="dictId"
          :loading="loading"
          :total="total"
          :showSelectInfo='false'
          :showRowSelection='true'
          :selectedRowKeys='selectedRowKeys'
          :selectedRows='selectedRows'
          :pageNum="pageNum"
          :pageSize="pageSize"
          :page-size-options="pageSizeOptions"
          :sortChange="onSortChange"
          :selectedRowChange="onSelectChange"
          :pageSizeChange="onPageSizeChange"
          :pageNumChange="onPageNumChange"
          :expandedRowRender="onExpandCurrent">
        <template slot="expandedRowRender" slot-scope="{text,record}">
          <dict-data ref="dictData"
              :dictId="record.dictId"
              :dictType="record.dictType"/>
        </template>
        <template slot="status" slot-scope="{text,record}">
          <span v-html="statusFormat(text,record)"></span>
        </template>
        <template slot="operation" slot-scope="{text,record}">
          <a @click="$refs.createForm.handleUpdate(record, undefined)" v-hasPerm="['system:dict:edit']">
            <a-icon type="edit" />修改
          </a>
          <a-divider type="vertical" v-hasPerm="['system:dict:delete']"/>
          <a @click="handleDelete(record)" v-hasPerm="['system:dict:delete']">
            <a-icon type="delete" />删除
          </a>
        </template>
      </standard-table>
      <!-- 增加修改 -->
      <create-form
          ref="createForm"
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

import {dataSource,metadataSource} from '@/services/index'
import CreateForm from './modules/CreateForm'
import DictData from './modules/DictData'

export default {
  name: 'Dict',
  components: {
    PageLayout,
    StandardTable,
    CreateForm,
    DictData,
  },
  mixins: [tableMixin],
  data () {
    return {
      list: [],
      total: 0,
      loading: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      timeRange:
          {
            今天: [this.$moment().startOf('day'), this.$moment()],
            昨天: [this.$moment().startOf('day').subtract(1,'days'), this.$moment().endOf('day').subtract(1, 'days')],
            最近三天: [this.$moment().startOf('day').subtract(2, 'days'), this.$moment().endOf('day')],
            最近一周: [this.$moment().startOf('day').subtract(1, 'weeks'), this.$moment()],
            本月: [this.$moment().startOf('month'), this.$moment()],
            本年: [this.$moment().startOf('year'), this.$moment()]
          },
      expandedKeys: [],
      columns: [
        {
          title: '字典编号',
          sorter: true,
          dataIndex: 'dictId',
          align: 'center'
        },
        {
          title: '字典名称',
          sorter: true,
          dataIndex: 'dictName',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '字典类型',
          dataIndex: 'dictType',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
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
    this.statusOptions = this.$store.getters.dictTypes.system_normal_disable
  },
  computed: {
  },
  watch: {
  },
  methods: {
    /** 查询字典列表 */
    getList () {
      this.loading = true
      this.addDateRange(this.queryParam,this.dateRange,"create")
      dataSource.dictList({...this.queryParam}).then(res => {
        const {rows, count} = res
          this.list = rows
          this.total = count
          this.loading = false
        }
      )
    },
    // 参数系统内置字典翻译
    statusFormat (text, row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      var that = this
      const dictIds = row.dictId ? [row.dictId] : this.selectedRowKeys
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中字典编号为' + dictIds + '的数据',
        onOk () {
          return dataSource.dictRemove({"dictIds":dictIds})
            .then(() => {
              that.onSelectChange([], [])
              that.getList()
              that.$message.success('删除成功' )
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
          that.download('system/dict/type/export', {
            ...that.queryParam
          }, `字典类型${new Date().getTime()}.xlsx`)
        },
        onCancel () {}
      })
    },
    /** 清理缓存按钮操作 */
    handleRefreshCache () {
      this.refreshing = true
      // refreshCache().then(() => {
      //   this.$message.success('刷新成功')
      // }).finally(() => {
      //   this.refreshing = false
      // })
    },
    onExpandCurrent (expandedKeys, row) {
      debugger
      if (expandedKeys) {
        this.expandedKeys = [row.dictId]
      } else {
        this.expandedKeys = []
      }
    }
  }
}
</script>
