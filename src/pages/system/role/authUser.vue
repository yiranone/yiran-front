<template>
  <page-layout title=" ">
    <div slot="headerContent">
    </div>
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="登录账号">
                <a-input v-model="queryParam.loginName" placeholder="请输入" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="手机号码">
                <a-input v-model="queryParam.phoneNumber" placeholder="请输入" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作 -->
      <div class="table-operations">
        <a-button type="primary" @click="$refs.selectUser.handleAuthUser()" v-hasPerm="['system:role:add']">
          <a-icon type="plus" />
          添加用户
        </a-button>
        <a-button type="danger" :loading="authing" :disabled="!isSelected" @click="cancelAuthUserAll" v-hasPerm="['system:role:delete']">
          <a-icon type="delete" />
          取消批量授权
        </a-button>
        <a-button type="primary" @click="back">
          <a-icon type="edit" />
          返回
        </a-button>
        <table-setting
          :style="{float: 'right'}"
          :table-size.sync="tableSize"
          v-model="columns"
          :refresh-loading="loading"
          @refresh="getList" />
      </div>
      <standard-table
          :columns="columns"
          :dataSource="list"
          :size="tableSize"
          rowKey="userId"
          :loading="loading"
          :total="total"
          :showSelectInfo='false'
          :showRowSelection='true'
          :selectedRowKeys='selectedRowKeys'
          :selectedRows='selectedRows'
          :pageNum="pageNum"
          :pageSize="pageSize"
          :sortChange="onSortChange"
          :selectedRowChange="onSelectChange"
          :pageSizeChange="onPageSizeChange"
          :pageNumChange="onPageNumChange"
      >
        <template slot="status" slot-scope="{text, record}">
          <span v-html="statusFormat(text, record)"></span>
        </template>
        <template slot="operation" slot-scope="{text, record}">
          <a @click="cancelAuthUser(record)" v-hasPerm="['system:role:delete']">
            <a-icon type="edit" />
            取消授权
          </a>
        </template>
      </standard-table>
      <select-user
          ref="selectUser"
          :roleId="roleId"
          :statusOptions="statusOptions"
          @ok="getList"
      />
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import { tableMixin } from '@/store/table-mixin'

import {dataSource , metadataSource} from '@/services/index'
import SelectUser from './modules/SelectUser'

export default {
  name: 'AuthUser',
  components: {
    SelectUser,StandardTable,PageLayout
  },
  mixins: [tableMixin],
  data () {
    return {
      roleId:'',
      list: [],
      total: 0,
      loading: false,
      authing: false,
      // 状态数据字典
      statusOptions: this.$store.getters.system_normal_disable,
      // 日期范围
      dateRange: [],
      columns: [
        {
          title: '用户ID',
          dataIndex: 'userId',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '登录账号',
          dataIndex: 'loginName',
          sorter:true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '用户名称',
          dataIndex: 'userName',
          sorter:true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          sorter:true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '手机号',
          sorter:true,
          dataIndex: 'phoneNumber',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          sorter:true,
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '创建时间',
          sorter:true,
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '20%',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ]
    }
  },
  filters: {
  },
  created () {
  },
  mounted () {
    const roleId = this.$route.query && this.$route.query.roleId
    if (roleId) {
      this.roleId = roleId
      this.getList()
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    /** 查询授权用户列表 */
    getList () {
      this.loading = true
      this.queryParam.roleId = this.roleId
      dataSource.roleAllocatedUser(this.queryParam).then(response => {
        this.list = response.rows
        this.total = response.count
        this.loading = false
      })
    },
    statusFormat (text,row) {
      return this.selectDictLabel(this.$store.getters.system_user_status, text)
    },
    /** 取消授权按钮操作 */
    cancelAuthUser (row) {
      var that = this
      const loginName = row.loginName
      const roleId = this.queryParam.roleId
      this.$confirm({
        title: '确认要取消该用户的角色吗?',
        content: '当前选中用户' + loginName,
        onOk () {
          const param = {
            userIds: [row.userId],
            roleId: roleId
          }
          return dataSource.roleUnAuthUser(param).then(() => {
            that.onSelectChange([], [])
            that.getList()
            that.$message.success('取消授权成功')
          })
        },
        onCancel () {}
      })
    },
    /** 批量取消授权按钮操作 */
    cancelAuthUserAll () {
      var that = this
      const roleId = this.queryParam.roleId
      this.$confirm({
        title: '是否取消选中用户授权数据项?',
        onOk () {
          const param = {
            roleId: roleId,
            userIds: that.selectedRowKeys
          }
          that.authing = true
          return dataSource.roleUnAuthUser(param).then(() => {
            that.onSelectChange([], [])
            that.getList()
            that.$message.success('取消授权成功')
          }).finally(() => {
            that.authing = false
          })
        },
        onCancel () {}
      })
    },
    back () {
      this.$router.back()
      // this.$router.push({ path: '/system/role' })
    }
  }
}
</script>
