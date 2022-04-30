<template>
  <page-layout title=" ">
    <div style="width: 100%" slot="headerContent">
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
        <template slot="showHome" slot-scope="{text, record}">
          <a-switch :checked="record.showOnHomePage" @change="handleShow(record)" />
        </template>
        <template slot="action" slot-scope="{record}">
          <a-spin :spinning="loadingBalanceId === record.balanceId">
            <a-icon slot="indicator" type="loading" spin />
            <div class="flex">
              <a-link type="primary" style="margin-right: 10px" @click="handleAction(record, 'rechange')">充币</a-link>
              <a-link type="primary" @click="handleAction(record, 'withdraw')">提币</a-link>
            </div>
            <div class="flex">
              <a-link type="primary" style="margin-right: 10px" @click="handleAction(record, 'gather')">归集</a-link>
              <a-link type="primary" @click="handleAction(record, 'createCode')">创建兑换码</a-link>
            </div>
            <div class="flex">
              <a @click="refreshRecord(record)">
                <a-icon type="reload" />刷新
              </a>
            </div>
          </a-spin>
        </template>
      </standard-table>
    </a-card>
    <rechange-modal :visible="rechangeVisible" :asset-info="assetInfo" @cancle="rechangeVisible = false"/>
    <gather-modal :visible="gatherVisible" @cancle="gatherVisible = false" :asset-info="assetInfo"/>
    <withdraw-modal :visible="withdrawVisible" @cancle="withdrawVisible = false" :asset-info="assetInfo"/>
    <set-pay-pwd :visible="setPayPwdVisible" :asset-info="assetInfo" @cancle="setPayPwdVisible = false" @success="setPayPwdSuccess"/>
    <create-code :visible.sync="createCodeVisible" :asset-info="assetInfo"/>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import Query from './query'
  import StandardTable from '../../../components/table/StandardTable'
  import RechangeModal from '@/pages/home/rechargeModal'
  import GatherModal from '@/pages/home/getherModal'
  import WithdrawModal from '@/pages/home/withdrawModal'
  import SetPayPwd from '@/pages/home/setPayPwd'
  import CreateCode from '@/pages/home/createCode'
  import TypeSet from '../../common/type-set'
  import {dataSource as ds} from '../../../services/index'
  import {userService as us} from '../../../services'

  const columns = [
    {
      title: '账户标识',
      dataIndex: 'srcSys',
      sorter: true,
      align: 'center',
      width: 100
    }, {
      title: '账户名称',
      dataIndex: 'accountName',
      sorter: true,
      align: 'center',
      width: 100,
/*
      fixed: 'left'
*/
    }, {
      title: '账户',
      dataIndex: 'accountId',
      sorter: true,
      align: 'center',
      width: 70
    }, {
      title: '币名称',
      dataIndex: 'currency',
      sorter: true,
      align: 'center',
      width: 80
    }, {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
      width: 150
    }, {
      title: '可用余额',
      dataIndex: 'availableAmount',
      align: 'center',
      sorter: true,
      width: 120,
      customRender: (value) => Number(value)
    }, {
      title: '未结手续费',
      dataIndex: 'serviceAmount',
      sorter: true,
      align: 'center',
      width: 120,
      customRender: (value) => Number(value)
    }, {
      title: '冻结余额',
      dataIndex: 'frozenAmount',
      sorter: true,
      align: 'center',
      width: 120,
      customRender: (value) => Number(value)
    }, {
      title: '外部余额',
      dataIndex: 'externalAmount',
      sorter: true,
      align: 'center',
      width: 120,
      customRender: (value) => Number(value)
    }, {
      title: '总余额',
      dataIndex: 'totalAmount',
      align: 'center',
      width: 120,
      customRender: (value) => Number(value)
    }, {
      title: '是否展示在首页',
      scopedSlots: { customRender: 'showHome' },
      align: 'center',
      fixed: 'right',
      width: 80,
    }, {
      title: '操作',
      scopedSlots: { customRender: 'action' },
      fixed: 'right',
      width: 150,
    }
  ]

  export default {
    components: {PageLayout, Query, StandardTable, TypeSet, RechangeModal, GatherModal, WithdrawModal, SetPayPwd, CreateCode},
    name: "inner",
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
        rechangeVisible: false,
        gatherVisible: false,
        withdrawVisible: false,
        setPayPwdVisible: false,
        createCodeVisible: false,
        loadingBalanceId: '',
        assetInfo: {},
        type: ''
      }
    },

    provide() {
      return {
        parent: this
      }
    },

    created() {
      this.getList()
    },

    methods: {
      getList() {
        this.loading = true
        const {pageNum, pageSize, conditions} = this
        ds.innerAccountBlanceList({pageNum, pageSize, ...conditions}).then(res => {
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
        // this.pageNum = 1
        this.getList()
      },

      changeSize(key) {
        this.colSize = key
      },

      async handleShow(record) {
        this.loading = true
        await us.isShowOnHomePage({
          balanceId: record.balanceId,
          value: !record.showOnHomePage,
          srcSys: record.srcSys
        }).then(res => {
          this.$message.success('操作成功')
          record.showOnHomePage = res.showOnHomePage
        }).catch(() => {})
        this.loading = false
      },

     /* refreshRecord(record) {
        us.refreshInnerStatics({
          addressId: record.addressId,
          balanceId: record.balanceId,
          accountId: record.accountId,
          chain: record.chain,
          srcSys: record.srcSys,
          currency: this.coinInfo.currency
        }).then(res => {
          this.$message.success('刷新成功！')
          this.$emit('refresh', res)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }*/

      refreshRecord(record) {
        this.loading = true
        us.refreshInnerStatics({
          balanceId: record.balanceId,
          srcSys: record.srcSys
        }).then(res => {
          this.$message.success('刷新成功！')
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].balanceId == res.balanceId) {
              this.dataSource[i] = {...this.dataSource[i], ...res}
              break
            }
          }
          this.dataSource = [...this.dataSource]
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },

      async handleAction(record, type) {
        this.type = type
        if ( type === 'withdraw' || type=== 'createCode') {
          if(this.loadingBalanceId === record.balanceId) return;
          this.loadingBalanceId = record.balanceId
          await ds.sysAddressList({
            srcSys: record.srcSys,
            balanceId: record.balanceId
          }).then(res => {
            if (!res.isPayPwd) {
              this.setPayPwdVisible = true
            } else {
              this[`${type}Visible`] = true
            }
            record.withdrawAddress = res.address
            record.withdrawMin = res.withdrawMin
            record.withdrawRate = res.withdrawRate
          }).catch(() => {})
          this.loadingBalanceId = ''
        } else {
          this[`${type}Visible`] = true
        }
        this.assetInfo = record
        debugger
      },

      setPayPwdSuccess() {
        this.setPayPwdVisible = false
        this[`${this.type}Visible`] = true
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
