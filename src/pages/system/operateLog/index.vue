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
              <a-form-item label="系统模块">
                <a-input v-model="queryParam.title" placeholder="请输入系统模块" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="操作人员">
                <a-input v-model="queryParam.operName" placeholder="请输入操作人员" allow-clear/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="类型">
                  <a-select placeholder="操作类型" v-model="queryParam.businessType" style="width: 100%" allow-clear>
                    <a-select-option v-for="(d, index) in typeOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select placeholder="操作状态" v-model="queryParam.status" style="width: 100%" allow-clear>
                    <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="操作时间">
                  <a-range-picker style="width: 100%" v-model="dateRange" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" allow-clear/>
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
        <a-button type="danger" :disabled="!isSelected" @click="handleDelete" v-hasPerm="['system:operate:log:delete']">
          <a-icon type="delete" />删除
        </a-button>
        <a-button type="danger" @click="handleClean" v-hasPerm="['system:operate:log:delete']">
          <a-icon type="delete" />清空
        </a-button>
        <a-button type="primary" @click="handleExport" v-hasPerm="['system:operate:log:export']">
          <a-icon type="download" />导出
        </a-button>
        <table-setting
          :style="{float: 'right'}"
          :table-size.sync="tableSize"
          v-model="columns"
          :refresh-loading="loading"
          @refresh="getList" />
      </div>
      <!-- 详细信息 -->
      <view-form ref="viewForm" />
      <!-- 数据展示 -->
      <a-table
        :loading="loading"
        :size="tableSize"
        :rowKey="rowKey"
        :columns="columns"
        :data-source="list"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :pagination="false"
        :bordered="tableBordered"
        @change="onSortChange"
      >
        <span slot="businessType" slot-scope="text, record">
          <span v-html="typeFormat(text, record)"></span>
        </span>
        <div slot="status" slot-scope="text, record">
           <span v-html="statusFormat(text, record)"></span>
        </div>
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.viewForm.handleView(record)" v-hasPerm="['system:operate:log:view']">
            <a-icon type="eye" />详细
          </a>
        </span>
      </a-table>
      <!-- 分页 -->
      <a-pagination
        class="ant-table-pagination"
        show-size-changer
        show-quick-jumper
        :current="pageNum"
        :total="total"
        :page-size="pageSize"
        :pageSizeOptions="pageSizeOptions"
        :showTotal="total => `共 ${total} 条`"
        @showSizeChange="onShowSizeChange"
        @change="changeSize"
      />
    </a-card>
  </page-layout>

</template>

<script>

import {dataSource,metadataSource} from '@/services/index'
import ViewForm from './modules/ViewForm'
import { tableMixin } from '@/store/table-mixin'
import PageLayout from "@/layouts/PageLayout";
import {mapGetters, mapState} from "vuex";

export default {
  name: 'OperateLog',
  components: {
    ViewForm,
    PageLayout
  },
  mixins: [tableMixin],
  ...mapGetters('account', ['dictTypes']),
  data () {
    return {
      list: [],
      total: 0,
      // 高级搜索 展开/关闭
      advanced: false,
      loading: false,
      rowKey : "operateId",
      // 状态数据字典
      statusOptions: [],
      typeOptions: [],
      // 日期范围
      dateRange: [],
      columns: [
        {
          title: '日志编号',
          dataIndex: 'operateId',
          align: 'center'
        },
        {
          title: '系统模块',
          dataIndex: 'title',
          sorter: true,
          align: 'center'
        },
        {
          title: '操作类型',
          dataIndex: 'businessType',
          sorter: true,
          scopedSlots: { customRender: 'businessType' },
          align: 'center'
        },
        {
          title: '请求方式',
          sorter: true,
          dataIndex: 'requestMethod',
          align: 'center'
        },
        {
          title: '操作人员',
          dataIndex: 'operateName',
          align: 'center',
          sorter: true
        },
        {
          title: '主机',
          dataIndex: 'operateIp',
          sorter: true,
          align: 'center'
        },
        {
          title: '操作地点',
          dataIndex: 'operateLocation',
          sorter: true,
          align: 'center'
        },
        {
          title: '结果',
          dataIndex: 'status',
          sorter: true,
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '操作日期',
          dataIndex: 'operateTime',
          align: 'center',
          sorter: true,
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ]
    }
  },
  filters: {
  },
  created () {
    this.queryParam.orderByColumn='operateTime'
    this.queryParam.orderDirection='DESC'
    this.getList()
    this.statusOptions = this.$store.getters.system_result_status
    this.typeOptions = this.$store.getters.system_operate_type
    // metadataSource.dictListByType('system_result_status').then(data => {
    //   this.statusOptions = data
    // })
  },
  computed: {
  },
  watch: {
  },
  methods: {
    /** 查询登录日志列表 */
    getList () {
      this.loading = true
      dataSource.operateLogList(this.addDateRange(this.queryParam, this.dateRange)).then(data => {
          this.list = data.rows
          this.total = data.count
          this.loading = false
        }
      )
    },
    // 操作日志状态字典翻译
    statusFormat (value,record) {
      return this.selectDictLabel(this.statusOptions, value)
    },
    // 操作日志类型字典翻译
    typeFormat (text, row) {
      return this.selectDictLabel(this.typeOptions, row.businessType)
    },

    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      var that = this
      const operateIds = row.operateId != null ? [row.operateId] : this.selectedRowKeys
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中日志编号为' + operateIds + '的数据',
        onOk () {
          return dataSource.operateLogRemove({operateIds:operateIds})
            .then(() => {
              that.onSelectChange([], [])
              that.getList()
              that.$message.success('删除成功')
          })
        },
        onCancel () {}
      })
    },
    /** 清空按钮操作 */
    handleClean () {
      var that = this
      this.$confirm({
        title: '是否确认清空?',
        content: '此操作将会清空所有操作日志数据项',
        onOk () {
          return dataSource.operateLogClean()
            .then(() => {
              that.onSelectChange([], [])
              that.getList()
              that.$message.success('清空成功')
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
          that.download('system/operate/log/export', {
            ...that.queryParam
          }, `操作日志_${new Date().getTime()}.xlsx`)
        },
        onCancel () {}
      })
    }
  }
}
</script>
