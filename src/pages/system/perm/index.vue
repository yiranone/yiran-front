<template>
  <page-layout title=" ">
    <div slot="headerContent">
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
                    @click="deleteRecord('batch')">
            <a-icon type="delete"/>
            批量删除
          </a-button>
        </div>
      </div>
      <standard-table
          :columns="columns"
          :dataSource="dataSource"
          rowKey="permId"
          :loading="loading"
          :pagination="{
            current: pageNum,
            pageSize: pageSize,
            pageSizeOptions: ['10', '20', '50', '100', '200'],
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
              @confirm="() => deleteRecord(record.permId)"
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
  import StandardTable from '../../../components/table/StandardTable'
  import MForm from './m-form'
  import {dataSource as ds} from '../../../services/index'
  import {userSource as us} from '../../../services/index'
  import {mapState} from 'vuex'
  import {handleTree} from "../../../utils/util";

  const columns = [
    {
      title: '权限编号',
      dataIndex: 'permId',
      sorter: true,
      align: 'center',
      width: 110
    }, {
      title: '权限名称',
      dataIndex: 'permName',
      align: 'center',
      width: 100
    },, {
      title: '权限组',
      dataIndex: 'permGroup',
      align: 'center',
      width: 80
    }, {
      title: '权限字符',
      dataIndex: 'permOperation',
      align: 'center',
      width: 100
    }, {
      title: '显示顺序',
      dataIndex: 'permSort',
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
    components: {PageLayout, StandardTable, MForm},
    data() {
      return {
        id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
        loading: false,
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
        ds.permsList({pageNum, pageSize, ...conditions}).then(res => {
          const {rows, count} = res
          this.dataSource = rows
          this.total = count
          this.loading = false
        }).catch(res => {
          this.loading = false
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
        console.log(this.delets)
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
      async deleteRecord(id) {
        this.loading = true
        if (id === 'batch') this.batchDeleteLoading = true;
        let delets = id === 'batch' ? this.delets : [id]
        await us.deletePerm({ids: delets}).then(res => {
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
            if (item.permId == res.permId) {
              item = {...item, ...res}
            }
            return item
          })
          console.log(this.dataSource, res)
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
