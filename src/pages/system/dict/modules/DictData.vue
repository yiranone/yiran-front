<template>
  <div>
    <create-data-form
      ref="createDataForm"
      :statusOptions="statusOptions"
      :dictType="dictType"
      @ok="getList"
    />
    <a-card :bordered="false"> <!-- :style="{ background: '#f5f8f8'}" -->
      <div class="table-operations">
        <a-button type="primary" size="small" @click="$refs.createDataForm.handleAdd()" v-hasPerm="['system:dict:add']" ghost>
          <a-icon type="plus" />新增
        </a-button>
        <a-button type="danger" :disabled="!isSelected" size="small"  @click="handleDelete" v-hasPerm="['system:dict:delete']">
          <a-icon type="delete" />删除
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
          rowKey="dictCode"
          :loading="loading"
          :total="total"
          :showSelectInfo='false'
          :showRowSelection='true'
          :show-page-buttons='false'
          :selectedRowKeys='selectedRowKeys'
          :selectedRows='selectedRows'
          :pageNum="pageNum"
          :pageSize="pageSize"
          :sortChange="onSortChange"
          :selectedRowChange="onSelectChange"
          :pageSizeChange="onPageSizeChange"
          :pageNumChange="onPageNumChange">
          <template slot="status" slot-scope="{text, record}">
            <span v-html="statusFormat(text,record)"></span>
          </template>
          <template slot="operation" slot-scope="{text, record}">
            <a @click="$refs.createDataForm.handleUpdate(record)" v-hasPerm="['system:dict:edit']">
              <a-icon type="edit" />修改
            </a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record)" v-hasPerm="['system:dict:delete']">
              <a-icon type="delete" />删除
            </a>
          </template>
      </standard-table>
    </a-card>
  </div>
</template>

<script>

import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import { tableMixin } from '@/store/table-mixin'

import {dataSource,metadataSource} from '@/services/index'
import CreateDataForm from './CreateDataForm'

export default {
  name: 'DictData',
  components: {
    CreateDataForm,StandardTable
  },
  mixins: [tableMixin],
  props: {
    dictType: {
      type: String,
      required: true
    },
    dictId: {
      type: Number,
      required: true
    },
  },
  data () {
    return {
      list: [],
      total: 0,
      tableSize: 'small',
      loading: false,
      // 状态数据字典
      statusOptions: [],
      columns: [
        {
          title: '字典编码',
          dataIndex: 'dictCode',
          align: 'center'
        },
        {
          title: '字典标签',
          dataIndex: 'dictLabel',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '字典键值',
          dataIndex: 'dictValue',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '字典排序',
          dataIndex: 'orderNum',
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
    this.queryParam.dictId = this.dictId
    this.getList()
    this.statusOptions=this.$store.getters.dictTypes.system_normal_disable
    // metadataSource.dictListByType('system_normal_disable').then(data => {
    //   this.statusOptions = data
    // })
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getList () {
      this.loading = true
      dataSource.dictDataList(this.queryParam).then(data => {
          this.list = data
          this.loading = false
        }
      )
    },
    // 状态字典翻译
    statusFormat (text,record) {
      return this.selectDictLabel(this.statusOptions, record.status)
    },

    /** 删除按钮操作 */
    handleDelete (row) {
      var that = this
      const dictCodes = row.dictCode ? [row.dictCode] : this.selectedRowKeys
      this.$confirm({
        title: '确认删除所选中数据?',
        content: '当前选中字典编码为' + dictCodes + '的数据',
        onOk () {
          return dataSource.dictDataDelete({dictCodes:dictCodes})
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
