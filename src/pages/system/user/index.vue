<template>
  <page-layout title=" ">
    <div slot="headerContent">
    </div>
    <a-card :id="id">
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
          <a class="action-rest" :class="{'disabled': record.admin}" style="margin-right: 8px" @click="resetPwd(record)">
            <a-icon type="key"/>
            重置密码
          </a>
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
        </template>
      </standard-table>
      <m-form @success="mFormSuccess"/>
<!--      <m-reset-pwd />-->
    </a-card>
  </page-layout>
</template>

<script>
  import PageLayout from '@/layouts/PageLayout'
  import StandardTable from '@/components/table/StandardTable'
  import MForm from './m-form'
  import {dataSource as ds,userService as us} from '../../../services/index'

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
      dataIndex: 'createBy',
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

    created() {
      this.getList()
      this.getRoleList()
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

      onSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err) => {
          if (!err) {
            this.conditions = this.form.getFieldsValue()
            this.onQuery()
          }
        })
      },

      onReset() {
        this.form.resetFields();
        this.conditions = {};
        this.onQuery();
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

      /*重置密码*/
      resetPwd(record) {
        this.formType = '重置'
        this.initialValue = {...record}
        us.deleteUser({ids: delets}).then(res => {
          this.$message.success('删除成功')
          this.dataSource = this.dataSource.filter(item => {
            return !this.delets.includes(item.roleId)
          })
          this.total = this.total - this.delets.length
        }).catch(res => {
        })
        this.formVisible = true
      },

      /*删除*/
      async deleteRecord(id) {
        this.loading = true
        if (id === 'batch') this.batchDeleteLoading = true;
        let delets = id === 'batch' ? this.delets : [id]
        await us.deleteUser({ids: delets}).then(res => {
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
          this.dataSource = [res, ...this.dataSource]
          this.total++
        } else {
          this.dataSource = this.dataSource.map(item => {
            if (item.userId == res.userId) {
              item = {...res}
            }
            return item
          })
        }
      }
    }
  }
</script>