<template>
  <page-layout title=" ">
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
        <template slot="action" slot-scope="{text, record}">
          <a @click="refreshRecord(record)">
            <a-icon type="reload" />刷新
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
  import {dataSource as ds} from '../../../services/index'
  import {userService as us} from '../../../services'

  const columns = [
    {
      title: '账户标识',
      dataIndex: 'srcSys',
      sorter: true,
      align: 'center',
      width: 60
    },{
      title: '内部账户名称',
      dataIndex: 'accountName',
      sorter: true,
      align: 'center',
      width: 80
    },{
      title: '账户名称',
      dataIndex: 'externalName',
      sorter: true,
      align: 'center',
      width: 100
    }, {
      title: '外部账户ID',
      dataIndex: 'externalId',
      sorter: true,
      align: 'center',
      width: 60
    }, {
      title: '币名称',
      dataIndex: 'currency',
      sorter: true,
      align: 'center',
      width: 40
    }, {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
      width: 250
    }, {
      title: '可用余额',
      dataIndex: 'availableAmount',
      align: 'center',
      sorter: true,
      width: 100,
      customRender: (value) => Number(value)
    }, {
      title: '冻结余额',
      dataIndex: 'frozenAmount',
      sorter: true,
      align: 'center',
      width: 100,
      customRender: (value) => Number(value)
    }, {
      title: '总余额',
      dataIndex: 'totalAmount',
      align: 'center',
      width: 100,
      customRender: (value) => Number(value)
    }, {
      title: '操作',
      scopedSlots: { customRender: 'action' },
      align: 'center',
      fixed: 'right',
      width: 100,
    }
  ]

  export default {
    components: {PageLayout, Query, StandardTable, TypeSet},
    name: "external",
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
        ds.externalAccountBlanceList({pageNum, pageSize, ...conditions}).then(res => {
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
        this.pageNum = 1
        this.getList()
      },

      changeSize(key) {
        this.colSize = key
      },

      refreshRecord(record) {
        this.loading = true
        us.refreshExternalStatics({
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
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
