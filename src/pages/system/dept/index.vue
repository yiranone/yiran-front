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
                  label="部门名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 0}"
              >
                <a-input allowClear
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

      <div class="">
        <a-space class="operator">
          <a-button type="primary" @click="addRecord({'deptId':'0'})" style="margin-right: 5px">
            <a-icon type="plus"/>
            新增
          </a-button>
        </a-space>
        <standard-table
            :columns="columns"
            :dataSource="dataSource"
            :rowKey="(record, index) => record.deptId"
            :loading="loading"
            :pagination="false"
            @change="onChange"
        >
          <template slot="icon" slot-scope="{text}">
            <a-icon :type="text"/>
          </template>
          <template slot="action" slot-scope="{text, record}">
            <a style="margin-right: 8px" @click="addRecord(record)">
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
                @confirm="() => deleteRecord(record.deptId)"
            >
              <a style="margin-right: 8px" v-auth="`delete`">
                <a-icon type="delete"/>
                删除
              </a>
            </a-popconfirm>
          </template>
        </standard-table>
      </div>
      <m-form :formInfo="deptInfo" @success="onRefresh"/>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import MForm from './m-form'
import {dataSource as ds, userService as us} from '@/services/index'
import {handleTree} from "@/utils/util";

const columns = [
  {
    title: '部门名称',
    dataIndex: 'deptName',
    width: 220
  },{
    title: '部门编码',
    dataIndex: 'deptCode',
    width: 220
  }, {
    title: '排序',
    dataIndex: 'orderNum',
    sorter: true,
    align: 'center',
    width: 100
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    align: 'center',
    sorter: true,
    width: 200,
  }, {
    title: '操作',
    scopedSlots: {customRender: 'action'},
    align: 'right',
    width: 200
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
      formVisible: false,
      formType: '',
      form: this.$form.createForm(this),
      deptInfo: {},
      deleteDepts: [],
      batchDeleteLoading: false
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
      const {conditions} = this
      ds.deptList({...conditions}).then(res => {
        this.dataSource = handleTree(res, "deptId")
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

    addRecord(record) {
      this.formType = '新增'
      this.deptInfo = {
        parentId: record == null ? '0' : record.deptId,
        orderNum: 1,
      }
      this.formVisible = true
    },

    editRecord(obj) {
      this.formType = '编辑'
      this.deptInfo = {...obj}
      this.formVisible = true
    },

    async deleteRecord(id) {
      this.loading = true
      if (id === 'batch') this.batchDeleteLoading = true;
      let delets = id === 'batch' ? this.delets : [id]
      await ds.deptRemove({deptIds: delets}).then(res => {
        this.$message.success('删除成功')
        this.getList()
      }).catch(res => {
      })
      this.loading = false
      this.batchDeleteLoading = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
