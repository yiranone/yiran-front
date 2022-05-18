<template>
  <page-layout title=" ">
    <div slot="headerContent">
      <query :conditions="conditions" @onQuery="onQuery" :loading="loading"/>
    </div>
    <a-card :id="id">
      <div class="flex space-between">
        <div>
          <a-button type="primary" :disabled="delets.length === 0" @click="handleBatch('export')" style="margin-right: 5px">
            导出
          </a-button>
        </div>
        <type-set :colSize="colSize" @changeSize="changeSize" :elId="id" @refresh="onRefresh"/>
      </div>
      <standard-table
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="(record, index) => record.id"
          :col-size="colSize"
          :loading="loading"
          :scroll="{ x: '100%'}"
          :pagination="{
            current: pageNum,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showLessItems: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`
          }"
          :selectedRows.sync="selectedRows"
          :getCheckboxProps="record => ({
            props: {
              disabled: srcSys !== '' && record.srcSys !== srcSys
            }
          })"
          @change="onChange"
          @selectedRowChange="onSelectChange">
        <template slot="action" slot-scope="{text, record}">
          <a-popconfirm
              title="确认删除?"
              @confirm="() => deleteRecord(record)">
            <a style="margin-right: 8px;color: #ff4d4f" v-auth="`delete`">
              <a-icon type="delete"/>
              删除
            </a>
          </a-popconfirm>
        </template>
      </standard-table>
    </a-card>
    <a-modal
        v-model="exportShow"
        title="导出"
        :confirmLoading="confirmLoading"
        @cancel="exportShow = false"
        @ok="handleExport"
    >
      <a-form-model ref="formExport" :model="formExport" :rules="rules" :labelCol="{span: 5}" :wrapperCol="{span: 18}">
        <a-form-model-item label="支付密码" prop="password">
          <a-input-password v-model="formExport.password"
                            placeholder="请输入支付密码"
                            autocomplete="new-password"
                            visibilityToggle
          ></a-input-password>
        </a-form-model-item>
        <a-form-model-item label="短信验证码" prop="code">
          <a-input-search
              v-model="formExport.code"
              placeholder="请输入短信验证码"
              @search="handleCode"
          >
            <a-button :loading="codeLoading" :disabled="codeDisable" type="primary" slot="enterButton">
              {{ codeText }}
            </a-button>
          </a-input-search>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import Query from './query'
import StandardTable from '../../components/table/StandardTable'
import TypeSet from '../common/type-set'
import {dataSource as ds} from '../../services/index'
import {userService as us} from '../../services/index'

const columns = [
  {
    title: '兑换码',
    dataIndex: 'starCode',
    align: 'center',
    width: 120
  }, {
    title: '币种名称',
    dataIndex: 'currency',
    align: 'center',
    width: 80
  }, {
    title: '金额',
    dataIndex: 'amount',
    align: 'center',
    width: 100,
  }, {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    width: 100,
    customRender: (value) => {
      switch (value) {
        case 'SUCCESS':
          return '已核销'
        case 'NEW':
          return '待核销'

        default:
          return '--'
      }
    }
  },
  {
    title: '账户名',
    dataIndex: 'srcName',
    width: 100
  }, {
    title: '冻结地址',
    dataIndex: 'fromAddress',
    align: 'center',
    width: 150
  }, {
    title: '核销地址',
    dataIndex: 'targetAddress',
    align: 'center',
    width: 150,
  },
  // {
  //   title: '是否导出',
  //   dataIndex: 'isDeal',
  //   align: 'center',
  //   width: 80,
  //   customRender: (value) => value ? '是' : '否'
  // },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    width: 120,
  }, {
    title: '核销时间',
    dataIndex: 'dealTime',
    align: 'center',
    width: 120,
  }, {
    title: '操作',
    scopedSlots: {customRender: 'action'},
    align: 'center',
    fixed: 'right',
    width: 100,
  }
]

export default {
  components: {PageLayout, Query, StandardTable, TypeSet},
  data() {
    return {
      id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
      loading: false,
      colSize: 'middle',
      columns: columns,
      dataSource: [],
      conditions: {}, //查询条件
      exportShow: false,
      selectedRows: [],
      delets: [],
      batchDeleteLoading: false,
      formExport: {
        password: '',
        code: ''
      },
      rules: {
        password: {required: true, message: '支付密码不能为空', trigger: 'blur'},
        code: {required: true, message: '验证码不能为空', trigger: 'blur'}
      },
      total: 0,
      pageSize: 10,
      pageNum: 1,
      srcSys: '',
      confirmLoading: false,
      codeLoading: false,
      codeText: '获取验证码',
      token: '',
      timer: null
    }
  },

  provide() {
    return {
      parent: this
    }
  },

  authorize: {
    deleteRecord: 'delete'
  },

  filters: {
    statusStr(val) {
      switch (val) {
        case 'CONFIRMED':
          return '已完成'
        case 'NEW':
          return '新建'
        case 3:
          return '已审核'
        case 4:
          return '已发货'
      }
    }
  },

  watch: {
    exportShow() {
      this.$nextTick(() => {
        this.codeText = '获取验证码'
        if (this.timer) clearTimeout(this.timer);
        this.$refs.formExport.resetFields()
      })
    }
  },

  computed: {
    codeDisable() {
      return this.codeText.includes('s')
    }
  },

  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.loading = true
      const {pageNum, pageSize, conditions} = this
      ds.exchangeList({pageNum, pageSize, ...conditions}).then(res => {
        const {rows, count} = res
        this.dataSource = rows
        this.total = count
        this.loading = false
      })
    },

    onQuery(conditions) {
      this.conditions = {...this.conditions, ...conditions}
      this.getList()
    },

    onChange(pagination, filters, sorter, {currentDataSource}) {
      this.pageNum = pagination.current
      this.pageSize = pagination.pageSize
      this.conditions = {
        ...this.conditions,
        orderByColumn: sorter.columnKey,
        orderDirection: sorter.order ? sorter.order == 'ascend' ? 'ASC' : 'DESC' : undefined
      }
      this.getList()
    },

    onRefresh() {
      this.pageNum = 1
      this.conditions = {}
      this.pageSize = 10
      this.getList()
    },

    changeSize(key) {
      this.colSize = key
    },

    /*选中行改变触发*/
    onSelectChange(selectedRowKeys, selectedRows) {
      if (this.srcSys !== selectedRows[0].srcSys) {
        this.srcSys = selectedRows[0].srcSys
        this.dataSource = [...this.dataSource]
      }
      this.delets = [...selectedRowKeys]
    },

    handleBatch() {
      this.exportShow = true
    },

    async handleCode() {
      this.codeLoading = true
      await us.sendSms()
          .then(res => {
            this.token = res.token
            this.$message.success(`短信已发送`)
            let count = 60
            this.codeText = `还剩${count}s`
            this.timer = setInterval(() => {
              count--
              this.codeText = `还剩${count}s`
              if (count === 0) {
                clearInterval(this.timer)
                this.codeText = `重新获取`
              }
            }, 1000)
          }).catch(() => {
          })
      this.codeLoading = false
    },

    async handleExport() {
      this.confirmLoading = true
      await us.exportExchange({
        sysSrc: this.sysSrc,
        ids: this.delets,
        password: this.formExport.password,
        code: this.formExport.code,
        token: this.token
      }).then(res => {
        us.downloadExchange({fileName: res, delete: false})
      }).catch(() => {
      })
      this.exportShow = false
      this.confirmLoading = false
    },


    async deleteRecord(record) {
      this.loading = true
      await us.deleteExchange({srcSys: record.srcSys, id: record.id}).then(res => {
        this.$message.success('删除成功')
        this.onRefresh()
      }).catch(res => {
        this.loading = true
      })
    },
  }
}
</script>

<style lang="less" scoped>
/deep/ .page-header .page-header-wide .detail .main .content {
  width: 100%;

  > div {
    width: 100%;
  }
}
</style>
