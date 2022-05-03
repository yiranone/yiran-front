<template>
  <page-layout title=" ">
    <div slot="headerContent">
      <query :conditions="conditions" @onQuery="onQuery" :loading="loading"/>
    </div>
    <a-card :id="id">
      <div class="flex space-between">
        <div>
          <a-button type="primary" @click="addRecord" style="margin-right: 5px">
            <a-icon type="plus"/>
            新增
          </a-button>
        </div>
        <type-set :colSize="colSize" @changeSize="changeSize" :elId="id" @refresh="onRefresh"/>
      </div>
      <standard-table
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="(record, index) => record.menuId"
          :col-size="colSize"
          :loading="loading"
          :scroll="{ x: '100%'}"
          :pagination="false"
          @change="onChange"
      >
        <template slot="icon" slot-scope="{text}">
          <a-icon :type="text"/>
        </template>
        <template slot="action" slot-scope="{text, record}">
          <a v-if="record.menuType != 'F'" style="margin-right: 8px" @click="addRecord(record)">
            <a-icon type="plus"/>
            新增
          </a>
          <a class="action-editor" style="margin-right: 8px" @click="editRecord(record)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a-popconfirm
              v-if="dataSource.length"
              title="确认删除?"
              @confirm="() => deleteRecord(record.menuId)"
          >
            <a style="margin-right: 8px" v-auth="`delete`">
              <a-icon type="delete"/>
              删除
            </a>
          </a-popconfirm>
        </template>
      </standard-table>
      <m-form :formInfo="menuInfo" @success="onRefresh"/>
    </a-card>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import Query from './query'
  import StandardTable from '../../../components/table/StandardTable'
  import TypeSet from '../../common/type-set'
  import MForm from './m-form'
  import {dataSource as ds} from '../../../services/index'
  import {userService as us} from '../../../services/index'
  import {handleTree} from "../../../utils/util";

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      width: 150
    }, {
      title: '图标',
      dataIndex: 'icon',
      align: 'center',
      scopedSlots: {customRender: 'icon'},
      width: 50
    }, {
      title: '排序',
      dataIndex: 'orderNum',
      sorter: true,
      align: 'center',
      width: 40
    }, {
      title: '路由标识',
      dataIndex: 'router',
      align: 'center',
      width: 100
    }, {
      title: '权限字符',
      dataIndex: 'perms',
      align: 'center',
      width: 100
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      sorter: true,
      width: 100,
    }, {
      title: '操作',
      scopedSlots: {customRender: 'action'},
      align: 'center',
      width: 220,
    }
  ]

  export default {
    components: {PageLayout, Query, StandardTable, TypeSet, MForm},
    data() {
      return {
        id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
        loading: false,
        colSize: 'middle',
        columns: columns,
        dataSource: [],
        conditions: {}, //查询条件
        formVisible: false,
        formType: '',
        menuInfo: {},
        deletRoles: [],
        batchDeleteLoading: false
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

    created() {
      this.getList()
    },

    methods: {
      getList() {
        this.loading = true
        const {conditions} = this
        ds.menuList({...conditions}).then(res => {
          this.dataSource = handleTree(res, "menuId")
          this.loading = false
        })
      },

      onQuery(conditions) {
        this.conditions = {...this.conditions, ...conditions}
        this.getList()
      },

      onChange(pagination, filters, sorter, {currentDataSource}) {
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

      addRecord(record) {
        this.formType = '新增'
        this.menuInfo = {
          parentId: record && record.menuId
        }
        this.formVisible = true
      },

      editRecord(obj) {
        this.formType = '编辑'
        this.menuInfo = {...obj}
        this.formVisible = true
      },

      async deleteRecord(id) {
        this.loading = true
        await us.deleteMenu(id).then(res => {
          this.$message.success('删除成功')
          this.onRefresh()
        }).catch(res => {
          this.loading = true
        })
      }
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
