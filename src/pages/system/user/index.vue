<template>
  <page-layout title=" ">
    <div slot="headerContent">
    </div>
    <a-card>
      <div class="search">
        <a-form layout="horizontal" @submit="onSubmit" :form="form">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                  label="用户ID"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 0}"
              >
                <a-input allowClear
                         placeholder=""
                         v-decorator="['userId']"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                  label="用户名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 0}"
              >
                <a-input allowClear
                         placeholder=""
                         v-decorator="['userName']"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                  label="手机号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 0}"
              >
                <a-input allowClear
                         placeholder=""
                         v-decorator="['phoneNumber']"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                  label="部门"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 0}"
              >
                <a-input allowClear
                         placeholder=""
                         v-decorator="['deptName']"/>
              </a-form-item>
            </a-col>
            <a-col style="margin-top: 3px" :md="8" :sm="24">
              <a-button type="primary" htmlType="submit">查询</a-button>
              <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="flex space-between">
        <div>
          <a-button type="primary" @click="addRecord" style="margin-right: 5px">
            <a-icon type="plus"/>
            新增
          </a-button>
          <a-button type="danger"
                    :disabled="delets.length == 0"
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
          rowKey="userId"
          :loading="loading"
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
          <a class="action-editor" :class="{'disabled': record.admin}" style="margin-right: 8px" @click="editRecord(record)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a-divider type="vertical"/>
          <a-dropdown >
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多操作 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="$refs.resetPassword.handleResetPwd(record)">
                  <a-icon type="key" />
                  重置密码
                </a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                    v-if="dataSource.length && !record.admin"
                    title="确认删除?"
                    @confirm="() => deleteRecord(record.userId)"
                >
                  <a class="action-delete" style="margin-right: 8px;" v-auth="`delete`">
                    <a-icon type="delete"/>
                    删除
                  </a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </standard-table>
      <m-form :deptOptions="deptOptions"
                :statusOptions="statusOptions"
                :sexOptions="sexOptions"
                :channelOptions="channelOptions"
                @success="mFormSuccess"/>
<!--      <m-reset-pwd />-->
      <reset-password
          ref="resetPassword"
      />
    </a-card>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import StandardTable from '@/components/table/StandardTable'
  import MForm from './user-form'
  import ResetPassword from "./reset-password";
  import {dataSource as ds,userService as us, metadataSource as ms} from '@/services/index'

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      sorter: true,
      align: 'center',
      width: 80
    }, {
      title: '登录账号',
      dataIndex: 'loginName',
      align: 'center',
      width: 90
    }, {
      title: '用户名称',
      dataIndex: 'userName',
      align: 'center',
      width: 90
    }, {
      title: '手机',
      dataIndex: 'phoneNumber',
      align: 'center',
      width: 100
    }, {
      title: '部门',
      dataIndex: 'deptName',
      sorter: true,
      align: 'center',
      width: 100
    }, {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 80,
      scopedSlots: {customRender: 'status'}
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      sorter: true,
      width: 180,
      scopedSlots: {customRender: 'time'}
    }, {
      title: '修改人',
      dataIndex: 'updateBy',
      align: 'center',
      width: 80
    }, {
      title: '操作',
      scopedSlots: {customRender: 'action'},
      align: 'center',
      width: 180,
    }
  ]

  export default {
    components: {PageLayout, StandardTable, MForm, ResetPassword},
    data() {
      return {
        // 状态数据字典
        channelOptions: [],
        statusOptions: [],
        sexOptions: [],
        // 部门树选项
        deptOptions: [{
          id: 0,
          name: '',
          children: []
        }],
        loading: false,
        columns: columns,
        dataSource: [],
        conditions: {}, //查询条件
        total: 0,
        pageSize: 10,
        pageNum: 1,
        formVisible: false,
        formType: '新增',
        form: this.$form.createForm(this),
        formMenuType: 'M',
        initialValue: {},
        selectedRows: [],
        roleList: [],
        delets: [],
        batchDeleteLoading: false,
        resetPwdVisible: false
      }
    },


    created() {
      this.getList()
      this.getRoleList()
      this.getChannelList()
      this.getDeptTree()
      this.getUserStatusList()
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

    beforeRouteLeave(to, from, next) {
      this.formVisible = false
      next()
    },

    methods: {
      /*获取数据列表*/
      getList() {
        this.loading = true
        const {pageNum, pageSize, conditions} = this
        ds.userList({pageNum, pageSize, ...conditions}).then(res => {
          const {rows, count} = res
          this.dataSource = rows
          this.total = count
          this.loading = false
        }).catch(res => {
          this.loading = false
        })
      },

      /*获取角色列表*/
      getRoleList() {
        ds.roleList({pageNum: 1, pageSize: 100}).then(res => {
          const {rows, count} = res
          this.roleList = rows
        })
      },
      getChannelList () {
        ms.channelAll().then(data => {
          this.channelOptions = data
        })
      },

      getDeptTree () {
        ms.deptTree().then(data => {
          this.deptOptions = data
        })
      },

      getUserStatusList() {
        ms.dictListByType('system_user_status').then(data => {
          this.statusOptions = data
        })
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

      onSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err) => {
          if (!err) {
            this.pageNum = 1 //点击查询的时候到第一页
            this.conditions = this.form.getFieldsValue()
            this.getList()
          }
        })
      },

      onReset() {
        this.form.resetFields();
        this.pageNum = 1 //点击重置的时候到第一页
        this.conditions = {};
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
        us.detailUser({userId: record.userId}).then(res => {
          this.initialValue = {...res}
          this.formVisible = true
        }).catch(res => {
          console.info("用户编辑失败" + res)
        })
      },

      /*删除*/
      async deleteRecord(id) {
        this.loading = true
        if (id === 'batch') this.batchDeleteLoading = true;
        let delets = id === 'batch' ? this.delets : [id]
        await us.deleteUser({userIds: delets}).then(res => {
          this.$message.success('删除成功')
          this.getList()
        }).catch(res => {
        })
        this.loading = false
        this.batchDeleteLoading = false
      },

      mFormSuccess(res) {
        this.formVisible = false
        this.getList()
      }
    }
  }
</script>