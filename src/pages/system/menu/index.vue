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
                  label="菜单名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 0}"
              >
                <a-input allowClear
                         placeholder="请输入菜单名称"
                         v-decorator="['menuName']"/>
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
          <a-button type="primary" @click="addRecord({'menuId':'0'})" style="margin-right: 5px">
            <a-icon type="plus"/>
            新增
          </a-button>
        </a-space>
        <standard-table
            :columns="columns"
            :dataSource="dataSource"
            :rowKey="(record, index) => record.menuId"
            :col-size="colSize"
            :loading="loading"
            :pagination="false"
            @change="onChange"
        >
          <template slot="icon" slot-scope="{text}">
            <a-icon :type="text"/>
          </template>
          <template slot="action" slot-scope="{text, record}">
            <a v-if="record.menuType == 'M'" style="margin-right: 8px" @click="addRecord(record)">
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
      </div>
      <m-form :formInfo="menuInfo" @success="onRefresh"/>
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import MForm from './m-form'
import {dataSource as ds, userService as us} from '../../../services/index'
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
    align: 'left',
    width: 100
  }, {
    title: '类型',
    dataIndex: 'menuType',
    align: 'left',
    width: 40
  }, {
    title: '权限字符',
    dataIndex: 'perms',
    align: 'left',
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
    align: 'right',
    width: 220,
  }
]

export default {
  components: {PageLayout, StandardTable, MForm},
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
      form: this.$form.createForm(this),
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
      this.menuInfo = {
        parentId: record == null ? '0' : record.menuId,
        menuType: "M",
        orderNum: 1,
        visible: "0",
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

</style>
