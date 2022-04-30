<template>
  <page-layout title=" ">
    <m-detail :detail-info="detailInfo"/>
    <div slot="headerContent">
      <query :conditions="conditions" @onQuery="onQuery" :loading="loading"/>
    </div>
    <a-card :id="id">
      <type-set :colSize="colSize" @changeSize="changeSize" :elId="id" @refresh="onRefresh"/>
      <standard-table
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="(record, index) => index"
          :col-size="colSize"
          :loading="loading"
          :scroll="{ x: '100%'}"
          @change="onChange"
          @selectedRowChange="onSelectChange"
          :pagination="{
            current: pageNum,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showLessItems: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`
        }"
      >
        <template slot="status" slot-scope="{text}">
          {{text | statusStr}}
        </template>
        <template slot="type" slot-scope="{text}">
          {{text | typeStr}}
        </template>
        <template slot="action" slot-scope="{text, record}">
          <a style="display: block; margin-bottom: 10px" @click="checkDetail(record)">
            <svg-icon icon-name="detail" /> 详细
          </a>
          <a @click="refreshRecord(record)">
            <a-icon type="reload" /> 刷新
          </a>
        </template>
      </standard-table>
    </a-card>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import Query from './query'
  import StandardTable from '../../../components/table/StandardTable'
  import TypeSet from '../../common/type-set'
  import MDetail from './detail'
  import {dataSource as ds} from '../../../services/index'
  import {userService as us} from '../../../services'

  const columns = [
    {
      title: '账户标识',
      dataIndex: 'srcSys',
      align: 'center',
      width: 100
    }, {
      title: '账户名称',
      dataIndex: 'innerAccountName',
      align: 'center',
      width: 100
    },{
      title: '链名称',
      dataIndex: 'chain',
      align: 'center',
      width: 80
    },{
      title: '币名称',
      dataIndex: 'currency',
      align: 'center',
      width: 80
    }, {
      title: '交易类型',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      scopedSlots: {customRender: 'type'}
    }, {
      title: '交易金额',
      dataIndex: 'amount',
      sorter: true,
      align: 'center',
      width: 120,
      customRender: (value) => Number(value) || '-'
    }, {
      title: '交易时间',
      dataIndex: 'createTime',
      sorter: true,
      align: 'center',
      width: 120
    }, {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 90,
      scopedSlots: {customRender: 'status'}
    }, {
      title: '出资账户',
      dataIndex: 'fromAccount',
      align: 'center',
      width: 100
    }, {
      title: '出资地址',
      dataIndex: 'fromAddress',
      align: 'center',
      width: 150
    }, {
      title: '入资账户',
      dataIndex: 'toAccount',
      align: 'center',
      width: 100
    }, {
      title: '入资地址',
      dataIndex: 'toAddress',
      align: 'center',
      width: 150
    }, {
      title: '交易ID',
      dataIndex: 'txnId',
      align: 'center',
      width: 150
    }, {
      title: '余额',
      dataIndex: 'latestBalance',
      sorter: true,
      align: 'center',
      width: 120,
      customRender: (value) => Number(value) || '-'
    },  {
      title: '操作',
      scopedSlots: { customRender: 'action' },
      align: 'center',
      fixed: 'right',
      width: 70,
    }
  ]

  export default {
    components: {PageLayout, Query, StandardTable, TypeSet, MDetail},
    name: "withdraw",
    data() {
      return {
        id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
        loading: false,
        colSize: 'middle',
        columns: columns,
        dataSource: [],
        conditions: {}, //查询条件
        total: 0,
        pageSize: 10,
        pageNum: 1,
        detailVisible: false,
        detailInfo: {}
      }
    },

    provide() {
      return {
        parent: this
      }
    },

    filters: {
      statusStr(val) {
        switch (val) {
          case 'CONFIRMED':
            return '交易成功'
          case 'NEW':
            return '新建'
          case 'REVERTED':
            return '交易失败'
          case 'UNCONFIRMED':
            return '处理中'
          case 'SENT':
            return '已发出'
        }
      },
      typeStr(val) {
        switch (val) {
          case 'EXTERNAL_WITHDRAW':
            return '客户提现'
          case 'INTERNAL_WITHDRAW':
            return '内部提现'
          case 'GATHER_WITHDRAW':
            return '归集提现'
          case 'GIVE_OUT_WITHDRAW':
            return '发放提现'
          default:
            return '-'
        }
      }
    },

    created() {
      this.getList()
    },

    beforeRouteLeave(to, from, next) {
      this.detailVisible = false
      next()
    },

    methods: {
      getList() {
        this.loading = true
        const {pageNum, pageSize, conditions} = this
        ds.withdrawList({pageNum, pageSize, ...conditions}).then(res => {
          const {rows, count} = res
          this.dataSource = rows
          this.total = count
          this.loading = false
        })
      },

      onQuery(conditions) {
        this.conditions = {...this.conditions, ...conditions}
        this.pageNum = 1
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

      onSelectChange() {
        this.$message.info('选中行改变了')
      },

      onSizeChange(current, size) {
        this.pageNum = 1
        this.pageSize = size
        this.getList()
      },

      onPageChange(page, pageSize) {
        this.pageNum = page
        this.pageSize = pageSize
        this.getList()
      },

      onRefresh() {
        this.getList()
      },

      changeSize(key) {
        this.colSize = key
      },

      checkDetail(record) {
        this.detailInfo = record
        this.detailVisible = true
      },

      refreshRecord(record) {
        this.loading = true
        us.refreshTransactionByTxnId({txnId: record.txnId, srcSys: record.srcSys})
            .then(res => {
              let arr = res.find(item => item.type == record.type)
              for (let i = 0; i < this.dataSource.length; i++) {
                if (this.dataSource[i].txnId == arr.txnId) {
                  this.dataSource[i] = {...this.dataSource[i], ...arr}
                  break
                }
              }
              this.dataSource = [...this.dataSource]
              this.loading = false
            }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
