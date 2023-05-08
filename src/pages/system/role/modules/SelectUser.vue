<template>
  <a-modal
    ref="authRole"
    :title="'选择用户'"
    :width="1200"
    :visible="visible"
    :confirm-loading="submitLoading"
    @cancel="visible = false"
    @ok="confirm"
  >
    <div class="page-header-content">
      <a-card :bordered="false" class="content">
        <!-- 条件搜索 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="登录名称">
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
        </standard-table>
      </a-card>
    </div>
  </a-modal>
</template>

<script>

import {dataSource , metadataSource} from '@/services/index'
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import { tableMixin } from '@/store/table-mixin'

export default {
  name: 'AuthUser',
  props: {
    roleId: {
      type: String,
      required: true
    }
  },
  components: {
    StandardTable,PageLayout
  },
  mixins: [tableMixin],
  data () {
    return {
      // 表格数据
      list: [],
      total: 0,
      user: {},
        // 表格的高度
      tableHeight: document.documentElement.scrollHeight - 200 + 'px',
      loading: false,
      // 当前控件配置:
      submitLoading: false,
      visible: false,
      // 表格属性
      columns: [
        {
          title: '用户ID',
          dataIndex: 'userId',
          sorter:true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '登录名称',
          dataIndex: 'loginName',
          sorter:true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '用户名',
          dataIndex: 'userName',
          sorter:true,
          align: 'center'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '手机',
          dataIndex: 'phoneNumber',
          sorter:true,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter:true,
          scopedSlots: { customRender: 'createTime' },
          ellipsis: true,
          align: 'center'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    // 查询表数据
    getList () {
      this.loading = true
      this.queryParam.roleId= this.roleId
      dataSource.roleUnAllocatedUser(this.queryParam).then(response => {
        this.list = response.rows
        this.total = response.count
        this.loading = false
      })
    },
    // 打开(由外面的组件调用)
    handleAuthUser () {
      this.visible = true
      this.getList()
    },
    // 确认
    confirm () {
      const param = {
        roleId: this.roleId,
        userIds: this.selectedRowKeys
      }
      this.submitLoading = true
      dataSource.roleAuthUser(param).then(res => {
        this.$message.success("授权成功")
        this.selectedRowKeys=[]
        this.selectedRows=[]
        this.visible = false
        this.$emit('ok')
      }).finally(() => {
        this.submitLoading = false
      })
    },
    statusFormat (text,row) {
      return this.selectDictLabel(this.$store.getters.system_user_status, text)
    },
  }
}
</script>
