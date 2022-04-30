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
          <a-button type="danger" :disabled="delets.length == 0"
                    :loading="batchDeleteLoading"
                    v-auth="`delete`"
                    @click="deleteRecord">
            <a-icon type="delete"/>
            批量删除
          </a-button>
        </div>
        <type-set :colSize="colSize" @changeSize="changeSize" :elId="id" @refresh="onRefresh"/>
      </div>
      <standard-table
          :columns="columns"
          :dataSource="dataSource"
          :col-size="colSize"
          rowKey="roleId"
          :loading="loading"
          :scroll="{ x: '100%'}"
          :pagination="{
            current: pageNum,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showLessItems: true,
            showQuickJumper: true,
            showTotal: (total, range) => `总计 ${total} 条`
          }"
          :selectedRows.sync="selectedRows"
          :getCheckboxProps="record => ({
            props: {
              disabled: record.admin
            }
          })"
          @change="onChange"
          @selectedRowChange="onSelectChange"
      >
        <template slot="status" slot-scope="{text}">
          <a-tag :color="text == '1' ? 'red' : 'green'">{{text | statusStr}}</a-tag>
        </template>
        <template slot="time" slot-scope="{text, record}">
          {{record | timeStr}}
        </template>
        <template slot="action" slot-scope="{text, record}">
          <a class="action-editor" :class="{'disabled': record.admin && !user.admin}" style="margin-right: 8px"
             @click="editRecord(record)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a-popconfirm
              v-if="dataSource.length"
              title="确认删除?"
              @confirm="() => deleteRecord(record.key)"
          >
            <a class="action-delete" style="margin-right: 8px;" v-auth="`delete`">
              <a-icon type="delete"/>
              删除
            </a>
          </a-popconfirm>
        </template>
      </standard-table>
      <m-form @success="mFormSuccess"/>
      <!--      <m-reset-pwd />-->
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
  import {mapState} from 'vuex'
  import {handleTree} from "../../../utils/util";

  const columns = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      sorter: true,
      align: 'center',
      width: 110
    }, {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'center',
      width: 100
    }, {
      title: '权限字符',
      dataIndex: 'roleKey',
      align: 'center',
      width: 100
    }, {
      title: '显示顺序',
      dataIndex: 'roleSort',
      align: 'center',
      width: 100
    }, {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      scopedSlots: {customRender: 'status'}
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
      width: 150,
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
        total: 0,
        pageSize: 10,
        pageNum: 1,
        formVisible: false,
        formType: '新增',
        formMenuType: 'M',
        initialValue: {},
        selectedRows: [],
        permsList: [],
        delets: [],
        batchDeleteLoading: false
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
          case '1':
            return '停用'
          case '0':
            return '正常'
          default:
            return '正常'
        }
      },
      timeStr(val) {
        return val.updateTime || val.createTime || '-'
      }
    },

    computed: {
        ...mapState('account', ['user'])
    },

    created() {
      this.getList()
      this.getPermsList()
    },

    beforeRouteLeave(to, from, next) {
      this.formVisible = false
      next()
    },


    methods: {
      /*获取数据列表*/
      getList() {
        this.loading = true
        const {pageNum, pageSize, conditions} = this
        ds.roleList({pageNum, pageSize, ...conditions}).then(res => {
          const {rows, count} = res
          this.dataSource = rows
          this.total = count
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      },

      /*获取权限列表*/
      getPermsList() {
        ds.permsList({pageNum: 1, pageSize: 10000}).then(res => {
          const {rows, count} = res
          this.permsList = rows
        })
      },
      /*查询*/
      onQuery(conditions) {
        this.conditions = {...this.conditions, ...conditions}
        this.getList()
      },

      /*表格搜索条件改变查询*/
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

      /*type刷新*/
      onRefresh() {
        this.pageNum = 1
        this.conditions = {}
        this.pageSize = 10
        this.getList()
      },

      /*选中行改变触发*/
      onSelectChange(selectedRowKeys, selectedRows) {
        this.delets = [...selectedRowKeys]
      },

      /*列表行高改变*/
      changeSize(key) {
        this.colSize = key
      },

      /*新增*/
      addRecord() {
        this.formType = '新增'
        this.formVisible = true
      },

      /*编辑*/
      editRecord(record) {
        this.formType = '编辑'
        this.initialValue = {...record}
        this.formVisible = true
      },

      /*删除*/
      async deleteRecord(key) {
        this.loading = true
        if (key == undefined) this.batchDeleteLoading = true;
        let delets = key == undefined ? this.delets : [key]
        await us.deleteRole({ids: delets}).then(res => {
          this.$message.success('删除成功')
          this.dataSource = this.dataSource.filter(item => {
            return !this.delets.includes(item.roleId)
          })
          this.total = this.total - this.delets.length
        }).catch(res => {
        })
        this.loading = false
        this.batchDeleteLoading = false
      },

      mFormSuccess(res) {
        this.formVisible = false
        if (this.formType == '新增') {
          /*this.dataSource = [res, ...this.dataSource]
          this.total++*/
          this.onRefresh()
        } else {
          this.dataSource = this.dataSource.map(item => {
            if (item.roleId == res.roleId) {
              item = {...res}
            }
            return item
          })
        }
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

  /deep/ .ant-tag {
    margin-right: 0;
  }
</style>
