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
              <a-form-item label="参数名称">
                <a-input v-model="queryParam.configName" placeholder="请输入" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="参数键名">
                <a-input v-model="queryParam.configKey" placeholder="请输入" allow-clear/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="参数类型">
                  <a-select placeholder="请选择" v-model="queryParam.configType" style="width: 100%" allow-clear>
                    <a-select-option v-for="(d, index) in typeOptions" :key="index" :value="d.value">{{ d.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间">
                  <a-range-picker style="width: 100%" v-model="queryParam.dateRange" @change="dateChange"
                                  :placeholder="['开始时间','结束时间']" :ranges='timeRange'
                                  valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" allow-clear/>
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
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPerm="['system:config:add']">
          <a-icon type="plus" />新增
        </a-button>
        <a-button type="primary" :disabled="!isSelectedSingle" @click="$refs.createForm.handleUpdate(undefined, selectedRowKeys)" v-hasPerm="['system:config:edit']">
          <a-icon type="edit" />修改
        </a-button>
        <a-button type="danger" :disabled="!isSelected" @click="handleDelete" v-hasPerm="['system:config:delete']">
          <a-icon type="delete" />删除
        </a-button>
        <a-button type="primary" @click="handleExport" v-hasPerm="['system:config:export']">
          <a-icon type="download" />导出
        </a-button>
<!--        <a-button type="dashed" :loading="refreshing" @click="handleRefreshCache" v-hasPerm="['system:config:remove']">
          <a-icon type="redo" />刷新缓存
        </a-button>-->
        <table-setting
          :style="{float: 'right'}"
          :table-size.sync="tableSize"
          v-model="columns"
          :refresh-loading="loading"
          @refresh="getList" />
      </div>
      <!-- 增加修改 -->
      <create-form
        ref="createForm"
        :typeOptions="typeOptions"
        @ok="getList"
      />
      <!-- 数据展示 -->
      <a-table
        :loading="loading"
        :size="tableSize"
        rowKey="configId"
        :columns="columns"
        :data-source="list"
        @change="onSortChange"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :pagination="false"
        :bordered="tableBordered">
        <span slot="configType" slot-scope="text, record">
          {{ typeFormat(record) }}
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.createForm.handleUpdate(record, undefined)" v-hasPerm="['system:config:edit']">
            <a-icon type="edit" />修改
          </a>
          <a-divider type="vertical" v-hasPerm="['system:config:delete']" />
          <a @click="handleDelete(record)" v-hasPerm="['system:config:delete']">
            <a-icon type="delete" />删除
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
import CreateForm from './modules/CreateForm'
import { tableMixin } from '@/store/table-mixin'
import PageLayout from "@/layouts/PageLayout";

export default {
  name: 'Config',
  components: {
    CreateForm,
    PageLayout
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
      // 日期范围
      dateRange: [],
      startDate:'',
      endDate:'',
      columns: [
        {
          title: '参数主键',
          dataIndex: 'configId',
          align: 'center',
          sorter: true
        },
        {
          title: '参数名称',
          dataIndex: 'configName',
          sorter: true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '参数键名',
          dataIndex: 'configKey',
          sorter: true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '参数键值',
          dataIndex: 'configValue',
          sorter: true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '系统内置',
          dataIndex: 'configType',
          scopedSlots: { customRender: 'configType' },
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
    this.typeOptions = this.$store.getters.system_yes_no
  },
  computed: {
  },
  watch: {
  },
  methods: {
    /** 查询参数列表 */
    getList () {
      this.loading = true
      this.addDateRange(this.queryParam,this.queryParam.dateRange,"create")
      dataSource.configList(this.queryParam).then(data => {
          this.list = data.rows
          this.total = data.count
          this.loading = false
        }
      )
    },
    // 参数系统内置字典翻译
    typeFormat (row) {
      return this.selectDictLabel(this.typeOptions, row.configType)
    },
    dateChange(dates,dateStrings){
      this.startDate=dateStrings[0]
      this.endDate=dateStrings[1]
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      var that = this
      const configIds = row.configId ?  [row.configId] : this.selectedRowKeys
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + configIds + '的数据',
        onOk () {
          return dataSource.configRemove({configIds:configIds})
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
          that.download('system/config/export', {
            ...that.queryParam
          }, `config_${new Date().getTime()}.xlsx`)
        },
        onCancel () {}
      })
    },
    /** 刷新缓存按钮操作 */
    handleRefreshCache () {
      this.refreshing = true
      refreshCache().then(() => {
        this.$message.success(
          '刷新成功',
          3
        )
      }).finally(() => {
        this.refreshing = false
      })
    }
  }
}
</script>
