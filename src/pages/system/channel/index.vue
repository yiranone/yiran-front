<template>
  <page-layout title="" showPageTitle="false">
    <a-card :id="id">
      <div :class="expand ? 'search' : null">
        <a-form layout="horizontal" @submit="onSubmit" :form="form">
          <div :class="expand ? null: 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                    label="渠道名称"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 0}"
                >
                  <a-input allowClear
                           placeholder="请输入渠道名称"
                           v-decorator="['searchChannelName']"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                    label="渠道编码"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 0}"
                >
                  <a-input allowClear placeholder="" v-decorator="['searchChannelCode']"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                    label="状态"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 0}"
                >
                  <a-select allowClear placeholder="请选择" v-decorator="['searchStatus']">
                    <a-select-option value="0">正常</a-select-option>
                    <a-select-option value="1">停用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="expand">
              <a-col :md="8" :sm="24">
                <a-form-item
                    label="到期时间大于"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 0}"
                >
                  <a-date-picker style="width: 100%" placeholder="" v-decorator="['searchExpireDate1']"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                    label="到期时间小于"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 18, offset: 0}"
                >
                  <a-date-picker style="width: 100%" placeholder="" v-decorator="['searchExpireDate2']"/>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
          <a-button type="primary" htmlType="submit">查询</a-button>
          <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
          <a @click="expand = !expand" style="margin-left: 8px">
            {{ expand ? '收起' : '展开' }}
            <a-icon :type="expand ? 'up' : 'down'"/>
          </a>
          </span>
        </a-form>
      </div>

      <div class="">
        <a-space class="operator">
          <a-button type="primary" @click="addRecord">
            <a-icon type="plus"/> 新增 </a-button>
          <a-button type="danger"
                    :disabled="delets.length == 0"
                    :loading="batchDeleteLoading"
                    v-auth="`delete`"
                    @click="deleteRecord('batch')">
            <a-icon type="delete"/> 删除
          </a-button>
          <a-dropdown>
            <a-menu @click="handleMenuClick" slot="overlay">
              <a-menu-item key="addRecord" @click="addRecord">新增</a-menu-item>
              <a-menu-item @click="deleteRecord('batch')">删除</a-menu-item>
            </a-menu>
            <a-button>
              更多操作 <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </a-space>
<!--
        <type-set :colSize="colSize" @changeSize="changeSize" :elId="id" @refresh="onRefresh"/>
-->

        <standard-table
          :columns="columns"
          :dataSource="dataSource"
          :col-size="colSize"
          rowKey="channelId"
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
              disabled: record.status === '0'
            }
          })"
          @change="onChange"
          @selectedRowChange="onSelectChange"
      >
        <template slot="status" slot-scope="{text}">
          <a-tag :color="text == '1' ? 'red' : 'green'">{{ text | statusStr }}</a-tag>
        </template>
        <template slot="time" slot-scope="{text, record}">
          {{ record | timeStr }}
        </template>
        <template slot="action" slot-scope="{text, record}">
          <a class="action-editor" :class="{'disabled': record.admin}" style="margin-right: 8px"
             @click="editRecord(record)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a-popconfirm
              v-if="dataSource.length && !record.admin"
              title="确认删除?"
              @confirm="() => deleteRecord(record.channelId)"
          >
            <a class="action-delete" style="margin-right: 8px;" v-auth="`delete`">
              <a-icon type="delete"/>
              删除
            </a>
          </a-popconfirm>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item key="">
                <a class="action-editor" :class="{'disabled': record.admin}"
                   @click="editRecord(record)">
                  <a-icon type="edit"/>
                  编辑
                </a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                    v-if="dataSource.length && !record.admin"
                    title="确认删除?"
                    @confirm="() => deleteRecord(record.channelId)"
                >
                  <a class="action-delete" style="margin-right: 8px;" v-auth="`delete`">
                    <a-icon type="delete"/>
                    删除
                  </a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
            <a class="">
              更多操作 <a-icon type="down" />
            </a>
          </a-dropdown>
        </template>
      </standard-table>
      </div>
      <ChannelEdit @success="mFormSuccess"/>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '../../../components/table/StandardTable'
import TypeSet from '../../common/type-set'
import ChannelEdit from './m-form'
import {dataSource as ds} from '../../../services/index'
import moment from "moment";

const columns = [
  {
    title: '渠道ID',
    dataIndex: 'channelId',
    sorter: true,
    align: 'left',
    width: 100
  }, {
    title: '渠道名称',
    dataIndex: 'channelName',
    width: 100
  }, {
    title: '渠道编码',
    dataIndex: 'channelCode',
    width: 120
  }, {
    title: '到期时间',
    dataIndex: 'expireDate',
    align: 'left',
    sorter: true,
    width: 100,
  }, {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    sorter: true,
    width: 65,
    scopedSlots: {customRender: 'status'}
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    sorter: true,
    width: 180
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    align: 'center',
    sorter: true,
    width: 180
  }, {
    title: '创建人',
    dataIndex: 'createBy',
    align: 'center',
    width: 80
  }, {
    title: '修改人',
    dataIndex: 'updateBy',
    align: 'center',
    width: 80
  }, {
    title: '操作',
    scopedSlots: {customRender: 'action'},
    align: 'center'
  }
]

export default {
  components: {PageLayout, StandardTable, ChannelEdit},
  data() {
    return {
      id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
      loading: false,
      colSize: 'middle',
      columns: columns, //列表定义
      dataSource: [], //列表数据
      conditions: {}, //查询条件
      expand: false,
      form: this.$form.createForm(this),
      total: 0,
      pageSize: 10,
      pageNum: 1,
      formVisible: false,
      formType: '新增',
      initialValue: {},
      selectedRows: [],
      roleList: [],
      delets: [],
      batchDeleteLoading: false,
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
          return '-'
      }
    }
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
      ds.channelList({pageNum, pageSize, ...conditions}).then(res => {
        const {rows, count} = res
        this.dataSource = rows
        this.total = count
        this.loading = false
      }).catch(res => {
        this.loading = false
      })
    },

    onSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          this.conditions = this.form.getFieldsValue()
          this.conditions.searchExpireDate1 = this.conditions["searchExpireDate1"] != null ? moment(this.conditions["searchExpireDate1"]).format("YYYY-MM-DD") : null;
          this.conditions.searchExpireDate2 = this.conditions["searchExpireDate2"] != null ? moment(this.conditions["searchExpireDate2"]).format("YYYY-MM-DD") : null;
          this.onQuery()
        }
      })
    },
    onReset() {
      this.form.resetFields();
      this.conditions = {};
      this.onQuery();
    },

    /*获取角色列表*/
    getRoleList() {
      ds.roleList({pageNum: 1, pageSize: 100}).then(res => {
        const {rows, count} = res
        this.roleList = rows
      })
    },
    /*查询*/
    onQuery() {
      this.pageNum = 1
      this.pageSize = 10
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

    handleMenuClick (e) {
      if (e.key === 'delete') {

      }
    },

    /*新增*/
    addRecord() {
      this.formType = '新增'
      this.initialValue = {}
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
      console.info("deleteRecord id:" + id)
      if (id === 'batch')  {
        if(this.delets.length == 0) {
          this.$message.warn('至少选择一条记录')
          return
        }
        this.batchDeleteLoading = true;
      }
      this.loading = true
      console.info("deletes:" + this.delets)
      let delets = id === 'batch' ? this.delets : [id]
      await ds.channelRemove({ids: delets}).then(res => {
        this.$message.success('删除成功')
        this.getList()
      }).catch(res => {
      })
      this.loading = false
      this.batchDeleteLoading = false
    },

    mFormSuccess(res) {
      this.formVisible = false
      if (this.formType == '新增') {
        this.dataSource = [res, ...this.dataSource]
        this.total++
      } else {
        this.dataSource = this.dataSource.map(item => {
          if (item.channelId == res.channelId) {
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
.search{
  margin-bottom: 44px;
}
.fold{
  width: calc(100% - 216px);
  display: inline-block
}
.operator{
  margin-bottom: 3px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
